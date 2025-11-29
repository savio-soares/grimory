import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { LoginRequest } from '../types';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    console.log('[DEBUG] Login attempt for:', email);

    if (!email || !password) {
      console.log('[DEBUG] Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    console.log('[DEBUG] Supabase query result:', { 
      userFound: !!user, 
      error: error?.message,
      userEmail: user?.email 
    });

    if (error || !user) {
      console.log('[DEBUG] User not found or Supabase error');
      return res.status(401).json({ error: 'Invalid credentials', debug: { userFound: false, supabaseError: error?.message } });
    }

    // Verificar senha
    console.log('[DEBUG] Comparing passwords...');
    console.log('[DEBUG] Hash in DB:', user.password_hash?.substring(0, 20) + '...');
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('[DEBUG] Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials', debug: { userFound: true, passwordMatch: false } });
    }

    // Gerar token JWT
    console.log('[DEBUG] JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('[DEBUG] JWT_SECRET length:', process.env.JWT_SECRET?.length);
    
    const signOptions: SignOptions = { 
      expiresIn: '7d' 
    };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      signOptions
    );

    console.log('[DEBUG] Token generated successfully');

    // Retornar usuário sem senha
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('[DEBUG] Login error:', error);
    res.status(500).json({ error: 'Internal server error', debug: String(error) });
  }
});

// GET /api/auth/me - Verificar token e retornar usuário atual
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, savings, current_phase, created_at, updated_at')
      .eq('id', req.user!.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/auth/update - Atualizar dados do usuário
router.put('/update', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { savings, current_phase, name } = req.body;

    const updateData: Record<string, unknown> = {};
    if (savings !== undefined) updateData.savings = savings;
    if (current_phase) updateData.current_phase = current_phase;
    if (name) updateData.name = name;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user!.userId)
      .select('id, email, name, savings, current_phase, created_at, updated_at')
      .single();

    if (error) {
      return res.status(400).json({ error: 'Error updating user' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

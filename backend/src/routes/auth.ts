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

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const signOptions: SignOptions = { 
      expiresIn: '7d' 
    };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      signOptions
    );

    // Retornar usuário sem senha
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
      return res.status(400).json({ error: 'Erro ao atualizar usuário' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/checks/:date - Obter checks de uma data específica
router.get('/:date', async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.params;

    const { data: checks, error } = await supabase
      .from('daily_checks')
      .select('*, task:tasks(id, task_key, text, turn)')
      .eq('user_id', req.user!.userId)
      .eq('check_date', date);

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar checks' });
    }

    res.json(checks);
  } catch (error) {
    console.error('Get checks error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/checks/toggle - Toggle check de uma tarefa
router.post('/toggle', async (req: AuthRequest, res: Response) => {
  try {
    const { task_id, date, is_completed } = req.body;

    if (!task_id || !date) {
      return res.status(400).json({ error: 'task_id e date são obrigatórios' });
    }

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('daily_checks')
      .select('*')
      .eq('user_id', req.user!.userId)
      .eq('task_id', task_id)
      .eq('check_date', date)
      .single();

    if (existing) {
      // Atualizar
      const { data: check, error } = await supabase
        .from('daily_checks')
        .update({ is_completed: is_completed ?? !existing.is_completed })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar check' });
      }

      return res.json(check);
    }

    // Criar novo
    const { data: check, error } = await supabase
      .from('daily_checks')
      .insert({
        user_id: req.user!.userId,
        task_id,
        check_date: date,
        is_completed: is_completed ?? true,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Erro ao criar check' });
    }

    res.status(201).json(check);
  } catch (error) {
    console.error('Toggle check error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

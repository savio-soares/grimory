import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/history - Obter histórico do mês atual (ou especificado)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { year, month } = req.query;

    const now = new Date();
    const targetYear = year ? parseInt(year as string) : now.getFullYear();
    const targetMonth = month ? parseInt(month as string) : now.getMonth() + 1;

    // Calcular primeiro e último dia do mês
    const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
    const lastDay = new Date(targetYear, targetMonth, 0).getDate();
    const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${lastDay}`;

    const { data: history, error } = await supabase
      .from('daily_history')
      .select('*')
      .eq('user_id', req.user!.userId)
      .gte('history_date', startDate)
      .lte('history_date', endDate)
      .order('history_date');

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar histórico' });
    }

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/history - Salvar/atualizar histórico de um dia
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date, completion_percent, phase } = req.body;

    if (!date || completion_percent === undefined) {
      return res.status(400).json({ error: 'date e completion_percent são obrigatórios' });
    }

    // Upsert
    const { data: existing } = await supabase
      .from('daily_history')
      .select('*')
      .eq('user_id', req.user!.userId)
      .eq('history_date', date)
      .single();

    if (existing) {
      const { data: history, error } = await supabase
        .from('daily_history')
        .update({ completion_percent, phase })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar histórico' });
      }

      return res.json(history);
    }

    const { data: history, error } = await supabase
      .from('daily_history')
      .insert({
        user_id: req.user!.userId,
        history_date: date,
        completion_percent,
        phase,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Erro ao criar histórico' });
    }

    res.status(201).json(history);
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

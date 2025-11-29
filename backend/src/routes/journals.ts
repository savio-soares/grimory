import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Helper: Calcular início da semana (domingo)
function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().split('T')[0];
}

// Helper: Calcular fim da semana (sábado)
function getWeekEnd(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  return d.toISOString().split('T')[0];
}

// GET /api/journals - Listar todos os journals
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { data: journals, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', req.user!.userId)
      .order('week_start', { ascending: false });

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar journals' });
    }

    res.json(journals);
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/journals/current - Obter journal da semana atual
router.get('/current', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const weekStart = getWeekStart(now);

    const { data: journal, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', req.user!.userId)
      .eq('week_start', weekStart)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ error: 'Erro ao buscar journal' });
    }

    res.json(journal || { content: '', week_start: weekStart, week_end: getWeekEnd(now) });
  } catch (error) {
    console.error('Get current journal error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/journals - Criar/atualizar journal
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { content, week_start } = req.body;

    const now = new Date();
    const targetWeekStart = week_start || getWeekStart(now);
    const weekEnd = getWeekEnd(new Date(targetWeekStart + 'T00:00:00'));

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', req.user!.userId)
      .eq('week_start', targetWeekStart)
      .single();

    if (existing) {
      const { data: journal, error } = await supabase
        .from('journals')
        .update({ content })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar journal' });
      }

      return res.json(journal);
    }

    const { data: journal, error } = await supabase
      .from('journals')
      .insert({
        user_id: req.user!.userId,
        week_start: targetWeekStart,
        week_end: weekEnd,
        content,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Erro ao criar journal' });
    }

    res.status(201).json(journal);
  } catch (error) {
    console.error('Save journal error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

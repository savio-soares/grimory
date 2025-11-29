import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { TaskCreateRequest, TaskUpdateRequest } from '../types';

const router = Router();

// Aplicar auth em todas as rotas
router.use(authMiddleware);

// GET /api/tasks - Listar todas as tarefas do usuário
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { phase } = req.query;
    
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user!.userId)
      .eq('is_active', true)
      .order('turn')
      .order('sort_order');

    const { data: tasks, error } = await query;

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar tarefas' });
    }

    // Se phase foi especificada, filtrar no backend
    if (phase) {
      const phaseLevel = parseInt(phase as string);
      const filteredTasks = tasks?.filter(task => 
        task.min_phase <= phaseLevel && 
        (task.max_phase === null || task.max_phase >= phaseLevel)
      );
      return res.json(filteredTasks);
    }

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/tasks/all - Listar TODAS as tarefas (incluindo inativas) para edição
router.get('/all', async (req: AuthRequest, res: Response) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user!.userId)
      .order('turn')
      .order('sort_order');

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar tarefas' });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/tasks - Criar nova tarefa
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const taskData: TaskCreateRequest = req.body;

    if (!taskData.task_key || !taskData.text || !taskData.turn) {
      return res.status(400).json({ error: 'Campos obrigatórios: task_key, text, turn' });
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: req.user!.userId,
        task_key: taskData.task_key,
        text: taskData.text,
        turn: taskData.turn,
        min_phase: taskData.min_phase || 1,
        max_phase: taskData.max_phase || null,
        sort_order: taskData.sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Já existe uma tarefa com essa chave' });
      }
      return res.status(400).json({ error: 'Erro ao criar tarefa' });
    }

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/tasks/:id - Atualizar tarefa
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: TaskUpdateRequest = req.body;

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user!.userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Erro ao atualizar tarefa' });
    }

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/tasks/:id - Deletar tarefa (soft delete)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', req.user!.userId);

    if (error) {
      return res.status(400).json({ error: 'Erro ao deletar tarefa' });
    }

    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

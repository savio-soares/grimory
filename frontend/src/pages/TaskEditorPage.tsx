import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import { api } from '../lib/api';
import { ParticleBackground } from '../components/ParticleBackground';
import type { Task } from '../types';
import { TURN_NAMES } from '../types';

export function TaskEditorPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    task_key: '',
    text: '',
    turn: 'morning' as Task['turn'],
    min_phase: 1,
    max_phase: null as number | null,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getAllTasks() as Task[];
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTask.task_key || !newTask.text) {
      alert('Please fill in the key and task text');
      return;
    }

    try {
      await api.createTask({
        task_key: newTask.task_key,
        text: newTask.text,
        turn: newTask.turn,
        min_phase: newTask.min_phase,
        max_phase: newTask.max_phase,
      });
      setIsCreating(false);
      setNewTask({ task_key: '', text: '', turn: 'morning', min_phase: 1, max_phase: null });
      loadTasks();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error creating task');
    }
  };

  const handleUpdate = async (task: Task) => {
    try {
      await api.updateTask(task.id, {
        text: task.text,
        turn: task.turn,
        min_phase: task.min_phase,
        max_phase: task.max_phase,
        sort_order: task.sort_order,
        is_active: task.is_active,
      });
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error updating task');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to remove this task?')) return;

    try {
      await api.deleteTask(taskId);
      loadTasks();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error removing task');
    }
  };

  const toggleActive = async (task: Task) => {
    try {
      await api.updateTask(task.id, { is_active: !task.is_active });
      loadTasks();
    } catch (error) {
      console.error('Erro ao toggle active:', error);
    }
  };

  // Agrupar por turno
  const tasksByTurn = tasks.reduce((acc, task) => {
    if (!acc[task.turn]) acc[task.turn] = [];
    acc[task.turn].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ParticleBackground progress={0} />
        <div className="text-amber-500 text-xl cinzel animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200 pb-20">
      <ParticleBackground progress={30} />
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
          <Link
            to="/"
            className="p-2 text-gray-500 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-100 cinzel">
              Task Editor
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Customize Your Protocol
            </p>
          </div>
        </div>

        {/* Botão de Criar */}
        <button
          onClick={() => setIsCreating(true)}
          className="w-full mystic-card p-4 rounded-lg flex items-center justify-center gap-2 text-amber-500 hover:text-amber-400 hover:border-amber-600 transition-all mb-6"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>

        {/* Modal de Criação */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="mystic-card p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl cinzel text-amber-500 mb-4">New Task</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">
                    Unique Key
                  </label>
                  <input
                    type="text"
                    value={newTask.task_key}
                    onChange={(e) => setNewTask({ ...newTask, task_key: e.target.value })}
                    placeholder="ex: m_exercise"
                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">
                    Task Text
                  </label>
                  <input
                    type="text"
                    value={newTask.text}
                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                    placeholder="Task description"
                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase mb-1">
                    Turn
                  </label>
                  <select
                    value={newTask.turn}
                    onChange={(e) => setNewTask({ ...newTask, turn: e.target.value as Task['turn'] })}
                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-600"
                  >
                    <option value="morning">Morning</option>
                    <option value="day">Day</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="night">Night</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">
                      Min Phase
                    </label>
                    <select
                      value={newTask.min_phase}
                      onChange={(e) => setNewTask({ ...newTask, min_phase: parseInt(e.target.value) })}
                      className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-600"
                    >
                      <option value={1}>Month 1</option>
                      <option value={2}>Month 2</option>
                      <option value={3}>Month 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">
                      Max Phase
                    </label>
                    <select
                      value={newTask.max_phase || ''}
                      onChange={(e) => setNewTask({ ...newTask, max_phase: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-amber-600"
                    >
                      <option value="">No limit</option>
                      <option value={1}>Month 1</option>
                      <option value={2}>Month 2</option>
                      <option value={3}>Month 3</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2 px-4 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 py-2 px-4 bg-amber-900 hover:bg-amber-800 rounded text-white transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Tarefas por Turno */}
        {['morning', 'day', 'afternoon', 'night'].map((turn) => {
          const turnTasks = tasksByTurn[turn] || [];
          if (turnTasks.length === 0) return null;

          return (
            <div key={turn} className="mystic-card p-4 rounded-lg mb-4">
              <h3 className="text-amber-600 cinzel text-sm border-b border-gray-800 pb-2 mb-3 uppercase tracking-widest">
                {TURN_NAMES[turn]}
              </h3>

              <div className="space-y-2">
                {turnTasks
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded border ${
                        task.is_active
                          ? 'border-gray-800 bg-gray-900/30'
                          : 'border-red-900/30 bg-red-900/10 opacity-50'
                      }`}
                    >
                      {editingTask?.id === task.id ? (
                        // Modo de edição
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editingTask.text}
                            onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-amber-600"
                          />
                          <div className="flex gap-2 text-xs">
                            <select
                              value={editingTask.turn}
                              onChange={(e) => setEditingTask({ ...editingTask, turn: e.target.value as Task['turn'] })}
                              className="bg-black/50 border border-gray-700 rounded px-2 py-1 text-gray-300"
                            >
                              <option value="morning">Morning</option>
                              <option value="day">Day</option>
                              <option value="afternoon">Afternoon</option>
                              <option value="night">Night</option>
                            </select>
                            <select
                              value={editingTask.min_phase}
                              onChange={(e) => setEditingTask({ ...editingTask, min_phase: parseInt(e.target.value) })}
                              className="bg-black/50 border border-gray-700 rounded px-2 py-1 text-gray-300"
                            >
                              <option value={1}>Min: Month 1</option>
                              <option value={2}>Min: Month 2</option>
                              <option value={3}>Min: Month 3</option>
                            </select>
                            <select
                              value={editingTask.max_phase || ''}
                              onChange={(e) => setEditingTask({ ...editingTask, max_phase: e.target.value ? parseInt(e.target.value) : null })}
                              className="bg-black/50 border border-gray-700 rounded px-2 py-1 text-gray-300"
                            >
                              <option value="">Max: No limit</option>
                              <option value={1}>Max: Month 1</option>
                              <option value={2}>Max: Month 2</option>
                              <option value={3}>Max: Month 3</option>
                            </select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingTask(null)}
                              className="p-1 text-gray-500 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdate(editingTask)}
                              className="p-1 text-amber-500 hover:text-amber-400"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Modo de visualização
                        <>
                          <button
                            onClick={() => toggleActive(task)}
                            className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                              task.is_active
                                ? 'border-green-500 bg-green-500/20'
                                : 'border-red-500 bg-red-500/20'
                            }`}
                          />
                          <div className="flex-1 cursor-pointer" onClick={() => setEditingTask(task)}>
                            <span className="text-sm text-gray-300">{task.text}</span>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] text-gray-600 bg-gray-800 px-1 rounded">
                                {task.task_key}
                              </span>
                              <span className="text-[10px] text-amber-700 bg-amber-900/20 px-1 rounded">
                                Phase {task.min_phase}{task.max_phase ? `-${task.max_phase}` : '+'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1 text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

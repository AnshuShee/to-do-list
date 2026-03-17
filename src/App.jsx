import React, { useState, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    try {
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
      return [];
    }
  });
  const [taskInput, setTaskInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    if (editingId) {
      setTasks(tasks.map(t =>
        t.id === editingId ? { ...t, title: taskInput, description: descInput } : t
      ));
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: taskInput,
        description: descInput,
        completed: false,
        createdAt: new Date().toLocaleDateString()
      };
      setTasks([newTask, ...tasks]);
    }
    setTaskInput('');
    setDescInput('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setTaskInput(task.title);
    setDescInput(task.description);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.length - tasks.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">My Tasks</h1>
            <p className="text-slate-500 font-medium">Manage your daily goals efficiently</p>
          </div>
          <div className="flex gap-3 justify-center">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-center">
              <span className="block text-2xl font-bold text-blue-600">{stats.active}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Active</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-center">
              <span className="block text-2xl font-bold text-emerald-500">{stats.completed}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Done</span>
            </div>
          </div>
        </header>

        {/* Input Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 mb-8 border border-white/20 backdrop-blur-xl">
          <form onSubmit={addTask} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-lg font-medium placeholder:text-slate-400"
              />
            </div>
            <textarea
              placeholder="Add some details... (optional)"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none resize-none h-24 text-slate-600 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] shadow-lg ${editingId
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
            >
              {editingId ? 'Update Task' : 'Add Task to List'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setTaskInput(''); setDescInput(''); }}
                className="w-full py-2 text-slate-400 font-medium hover:text-slate-600 transition-colors"
              >
                Cancel Editing
              </button>
            )}
          </form>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-6 w-fit mx-auto md:mx-0">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 ${task.completed ? 'opacity-75' : ''
                  }`}
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`mt-1 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-200 hover:border-blue-400 bg-white'
                    }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`mt-1 text-sm leading-relaxed ${task.completed ? 'line-through text-slate-300' : 'text-slate-500'
                      }`}>
                      {task.description}
                    </p>
                  )}
                  <p className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    Created: {task.createdAt}
                  </p>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold text-lg">No tasks found</h3>
              <p className="text-slate-400 font-medium max-w-[200px] mx-auto mt-1">
                {filter === 'all'
                  ? "Start by adding your first task above!"
                  : `You don't have any ${filter} tasks.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
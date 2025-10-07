import React, { useState, useEffect, useRef } from 'react';
import { Check, X, ChevronDown, Flag, GripVertical } from 'lucide-react';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const editorRef = useRef(null);
  const menuRef = useRef(null);
  const [urlLogo, setUrlLogo] = useState("");


  const menuItems = [
    { type: 'header', label: 'TRANSFORMER EN' },
    { type: 'action', label: 'Todo avec checkbox', action: () => convertToTodo(), icon: <Check className="w-4 h-4" /> },
    { type: 'divider' },
    { type: 'header', label: 'TAILLE' },
    { type: 'style', label: 'Petit', style: { fontSize: 'small' }, className: 'text-sm' },
    { type: 'style', label: 'Normal', style: { fontSize: 'base' }, className: 'text-base' },
    { type: 'style', label: 'Grand', style: { fontSize: 'large' }, className: 'text-lg' },
    { type: 'style', label: 'Très grand', style: { fontSize: 'xl' }, className: 'text-xl' },
    { type: 'style', label: 'Énorme', style: { fontSize: '2xl' }, className: 'text-2xl' },
    { type: 'divider' },
    { type: 'header', label: 'COULEUR' },
    { type: 'style', label: 'Noir', style: { color: '#000000' }, className: 'text-black' },
    { type: 'style', label: 'Gris', style: { color: '#6b7280' }, className: 'text-gray-500' },
    { type: 'style', label: 'Marron', style: { color: '#92400e' }, className: 'text-yellow-900' },
    { type: 'style', label: 'Rouge', style: { color: '#ef4444' }, className: 'text-red-500' },
    { type: 'style', label: 'Orange', style: { color: '#f97316' }, className: 'text-orange-500' },
    { type: 'style', label: 'Jaune', style: { color: '#eab308' }, className: 'text-yellow-500' },
    { type: 'style', label: 'Vert', style: { color: '#10b981' }, className: 'text-green-500' },
    { type: 'style', label: 'Bleu', style: { color: '#3b82f6' }, className: 'text-blue-500' },
    { type: 'style', label: 'Violet', style: { color: '#8b5cf6' }, className: 'text-purple-500' },
    { type: 'style', label: 'Rose', style: { color: '#ec4899' }, className: 'text-pink-500' },
    { type: 'style', label: 'Indigo', style: { color: '#6366f1' }, className: 'text-indigo-500' },
    { type: 'style', label: 'Cyan', style: { color: '#06b6d4' }, className: 'text-cyan-500' },
    { type: 'style', label: 'Lime', style: { color: '#84cc16' }, className: 'text-lime-500' },
    { type: 'style', label: 'Emerald', style: { color: '#059669' }, className: 'text-emerald-600' },
    { type: 'style', label: 'Teal', style: { color: '#14b8a6' }, className: 'text-teal-500' },
    { type: 'divider' },
    { type: 'header', label: 'PRIORITÉ' },
    { type: 'style', label: 'Haute', style: { priority: 'high' }, icon: <Flag className="w-4 h-4 text-red-500" /> },
    { type: 'style', label: 'Moyenne', style: { priority: 'medium' }, icon: <Flag className="w-4 h-4 text-yellow-500" /> },
    { type: 'style', label: 'Basse', style: { priority: 'low' }, icon: <Flag className="w-4 h-4 text-green-500" /> },
    { type: 'style', label: 'Aucune priorité', style: { priority: 'none' } },
  ];

  const selectableItems = menuItems.filter(item => item.type === 'action' || item.type === 'style');

  // Charger les todos depuis localStorage au démarrage
  useEffect(() => {
    const savedTodos = localStorage.getItem('notion_todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Sauvegarder les todos dans localStorage à chaque modification
  useEffect(() => {
    if (todos.length >= 0) {
      localStorage.setItem('notion_todos', JSON.stringify(todos));
    }
  }, [todos]);

  // Navigation au clavier dans le menu
  useEffect(() => {
    const handleMenuKeyDown = (e) => {
      if (!showMenu) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMenuIndex((prev) => 
          prev < selectableItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMenuIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedItem = selectableItems[selectedMenuIndex];
        if (selectedItem) {
          if (selectedItem.action) {
            selectedItem.action();
          } else if (selectedItem.style) {
            applyStyle(selectedItem.style);
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMenu(false);
      }
    };

    window.addEventListener('keydown', handleMenuKeyDown);
    return () => window.removeEventListener('keydown', handleMenuKeyDown);
  }, [showMenu, selectedMenuIndex, selectableItems]);

  // Scroll automatique vers l'élément sélectionné
  useEffect(() => {
    if (showMenu && menuRef.current) {
      const selectedElement = menuRef.current.querySelector(`[data-index="${selectedMenuIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedMenuIndex, showMenu]);

  //curseur
  useEffect(() => {
    try {
      if (browser && browser.runtime && browser.runtime.getURL) {
        setUrlLogo(browser.runtime.getURL("icons/icon-16.png"));;
      } else {
        // Fallback for development or non-extension context
        setUrlLogo("/icons/icon-16.png");
      }
    } catch (error) {
      console.error("Extension API not available:", error);
      setUrlLogo("/icons/icon-16.png");
    }
  }, []);


  const handleKeyDown = (e, todoId) => {
    if (e.key === '\\') {
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      setMenuPosition({ x: rect.left, y: rect.bottom + 5 });
      setShowMenu(true);
      setCurrentTodoId(todoId);
      setSelectedMenuIndex(0);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNewTodo(todoId);
    }
  };

  const addNewTodo = (afterId = null) => {
    const newTodo = {
      id: Date.now(),
      content: '',
      completed: false,
      priority: 'none',
      fontSize: 'base',
      color: '#000000',
      isTodoItem: false
    };

    if (afterId === null) {
      setTodos([...todos, newTodo]);
    } else {
      const index = todos.findIndex(t => t.id === afterId);
      const newTodos = [...todos];
      newTodos.splice(index + 1, 0, newTodo);
      setTodos(newTodos);
    }

    setTimeout(() => {
      const inputs = document.querySelectorAll('.todo-input');
      inputs[inputs.length - 1]?.focus();
    }, 0);
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const applyStyle = (style) => {
    if (currentTodoId) {
      updateTodo(currentTodoId, style);
    }
    setShowMenu(false);
  };

  const convertToTodo = () => {
    if (currentTodoId) {
      updateTodo(currentTodoId, { isTodoItem: true });
    }
    setShowMenu(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-green-500 bg-green-50';
      default: return '';
    }
  };

  const getFontSize = (size) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'base': return 'text-base';
      case 'large': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      default: return 'text-base';
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  let selectableIndex = -1;

  return (
        <div
            className="min-h-screen bg-white p-8"
            style={{ cursor: `url(${urlLogo}), auto` }}
            >

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Ma Todo List</h1>
        
        <div className="space-y-2">
          {sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${getPriorityColor(todo.priority)} ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-2 mt-1">
                <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-grab" />
                
                {todo.isTodoItem && (
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={todo.content}
                  onChange={(e) => updateTodo(todo.id, { content: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, todo.id)}
                  placeholder="Tapez '\' pour les options..."
                  className={`todo-input w-full bg-transparent outline-none ${getFontSize(todo.fontSize)} ${
                    todo.completed ? 'line-through' : ''
                  }`}
                  style={{ color: todo.color }}
                />
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                {todo.priority !== 'none' && (
                  <Flag className={`w-4 h-4 ${
                    todo.priority === 'high' ? 'text-red-500' :
                    todo.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => addNewTodo()}
          className="mt-4 text-gray-400 hover:text-gray-600 text-sm flex items-center gap-2"
        >
          <span>+</span> Nouvelle ligne
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div
              ref={menuRef}
              className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-2 w-64 max-h-96 overflow-y-auto"
              style={{ left: menuPosition.x, top: menuPosition.y }}
            >
              <div className="space-y-1">
                {menuItems.map((item, index) => {
                  if (item.type === 'header') {
                    return (
                      <div key={index} className="text-xs font-semibold text-gray-500 px-2 py-1">
                        {item.label}
                      </div>
                    );
                  }
                  
                  if (item.type === 'divider') {
                    return <div key={index} className="border-t my-2" />;
                  }

                  if (item.type === 'action' || item.type === 'style') {
                    selectableIndex++;
                    const currentIndex = selectableIndex;
                    const isSelected = selectedMenuIndex === currentIndex;

                    return (
                      <button
                        key={index}
                        data-index={currentIndex}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else if (item.style) {
                            applyStyle(item.style);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${item.className || ''} ${
                          isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
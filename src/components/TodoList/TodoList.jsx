import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import TodoItem from "./TodoItem";
import AddTodoDialog from "./AddTodoDialog";
import FilterBar from "./FilterBar";

const TASK_TYPES = [
  { id: "work", label: "Travail", color: "blue" },
  { id: "personal", label: "Personnel", color: "green" },
  { id: "shopping", label: "Courses", color: "orange" },
  { id: "health", label: "Santé", color: "red" },
  { id: "learning", label: "Apprentissage", color: "purple" },
  { id: "other", label: "Autre", color: "gray" }
];

const PRIORITIES = [
  { id: "high", label: "Haute", color: "red" },
  { id: "medium", label: "Moyenne", color: "yellow" },
  { id: "low", label: "Basse", color: "green" }
];

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Charger les todos depuis localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("dfcraft_todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Sauvegarder les todos dans localStorage
  useEffect(() => {
    localStorage.setItem("dfcraft_todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now(),
      ...todo,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
    setShowAddDialog(false);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
  };

  // Filtrer les todos
  const filteredTodos = todos.filter(todo => {
    if (filterType !== "all" && todo.type !== filterType) return false;
    if (filterPriority !== "all" && todo.priority !== filterPriority) return false;
    if (filterStatus === "completed" && !todo.completed) return false;
    if (filterStatus === "active" && todo.completed) return false;
    return true;
  });

  // Trier par priorité
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Obtenir la date actuelle
  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", { 
    month: "long", 
    day: "numeric" 
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <div className="bg-light dark:bg-dark min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-lightElements dark:text-darkElements" />
            <span className="text-sm font-medium text-lightPlaceHolder dark:text-darkPlaceHolder capitalize">
              {formattedDate}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-lightElements dark:text-darkElements mb-4">
            Mes Tâches
          </h1>
          
          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="bg-lightList dark:bg-darkList rounded-lg px-4 py-2">
              <span className="text-sm text-lightPlaceHolder dark:text-darkPlaceHolder">Total: </span>
              <span className="font-bold text-lightElements dark:text-darkElements">{stats.total}</span>
            </div>
            <div className="bg-lightList dark:bg-darkList rounded-lg px-4 py-2">
              <span className="text-sm text-lightPlaceHolder dark:text-darkPlaceHolder">Actives: </span>
              <span className="font-bold text-blue-500">{stats.active}</span>
            </div>
            <div className="bg-lightList dark:bg-darkList rounded-lg px-4 py-2">
              <span className="text-sm text-lightPlaceHolder dark:text-darkPlaceHolder">Terminées: </span>
              <span className="font-bold text-green-500">{stats.completed}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          taskTypes={TASK_TYPES}
          priorities={PRIORITIES}
        />

        {/* Add Button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="w-full mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une tâche
        </button>

        {/* Todo List */}
        <div className="space-y-2">
          {sortedTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lightPlaceHolder dark:text-darkPlaceHolder text-lg">
                {filteredTodos.length === 0 && todos.length > 0 
                  ? "Aucune tâche ne correspond aux filtres"
                  : "Aucune tâche pour le moment"}
              </p>
            </div>
          ) : (
            sortedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                taskTypes={TASK_TYPES}
                priorities={PRIORITIES}
              />
            ))
          )}
        </div>

        {/* Add Dialog */}
        {showAddDialog && (
          <AddTodoDialog
            onAdd={addTodo}
            onClose={() => setShowAddDialog(false)}
            taskTypes={TASK_TYPES}
            priorities={PRIORITIES}
          />
        )}
      </div>
    </div>
  );
}
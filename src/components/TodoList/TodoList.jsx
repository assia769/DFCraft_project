import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import TodoItem from "./TodoItem";
import AddTodoDialog from "./AddTodoDialog";
import FilterBar from "./FilterBar";
import { useTranslation } from "../../shared/i18n/translations";
import { useSettings } from "../../shared/context/SettingsContext";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { t } = useTranslation("ToDoTasks");

  const TASK_TYPES = [
    { id: "work", label: t("work"), color: "blue" },
    { id: "personal", label: t("personal"), color: "green" },
    { id: "shopping", label: t("courses"), color: "orange" },
    { id: "health", label: t("health"), color: "red" },
    { id: "learning", label: t("underestanding"), color: "purple" },
    { id: "other", label: t("others"), color: "gray" },
  ];

  const PRIORITIES = [
    { id: "high", label: t("high"), color: "red" },
    { id: "medium", label: t("medium"), color: "yellow" },
    { id: "low", label: t("low"), color: "green" },
  ];

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
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
    setShowAddDialog(false);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, updatedTodo) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo,
      ),
    );
  };

  // Filtrer les todos
  const filteredTodos = todos.filter((todo) => {
    if (filterType !== "all" && todo.type !== filterType) return false;
    if (filterPriority !== "all" && todo.priority !== filterPriority)
      return false;
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

  const { settings } = useSettings();

  // Obtenir la date actuelle
  const today = new Date();
  const formattedDate = today.toLocaleDateString(settings.language, {
    month: "long",
    day: "numeric",
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
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
            {t("title")}
          </h1>

          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="bg-lightElements dark:bg-darkElements rounded-lg px-4 py-2">
              <span className="text-sm text-light dark:text-dark">
                {" "}
                {t("total")}
              </span>
              <span className="font-bold text-light dark:text-dark">
                {stats.total}
              </span>
            </div>
            <div className="bg-lightElements dark:bg-darkElements rounded-lg px-4 py-2">
              <span className="text-sm text-light dark:text-dark">
                {" "}
                {t("active")}
              </span>
              <span className="font-bold text-light dark:text-dark">
                {stats.active}
              </span>
            </div>
            <div className="bg-lightElements dark:bg-darkElements rounded-lg px-4 py-2">
              <span className="text-sm text-light dark:text-dark">
                {" "}
                {t("completed")}
              </span>
              <span className="font-bold text-light dark:text-dark">
                {stats.completed}
              </span>
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
          className="w-full mb-4 p-4 bg-gradient-to-r from-lightList to-lightElements dark:from-purple-600 dark:to-purple-400 hover:from-purple-500 hover:to-purple-700 text-light dark:text-dark font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t("ajouter")}
        </button>

        {/* Todo List */}
        <div className="space-y-2">
          {sortedTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lightPlaceHolder dark:text-darkPlaceHolder text-lg">
                {filteredTodos.length === 0 && todos.length > 0
                  ? t("existSearch")
                  : t("existance")}
              </p>
            </div>
          ) : (
            sortedTodos.map((todo) => (
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

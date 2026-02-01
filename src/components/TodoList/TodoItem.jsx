import { useState } from "react";
import { Check, Trash2, Edit2, X, Save } from "lucide-react";

export default function TodoItem({ todo, onToggle, onDelete, onEdit, taskTypes, priorities }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || "");
  const [editedType, setEditedType] = useState(todo.type);
  const [editedPriority, setEditedPriority] = useState(todo.priority);

  const taskType = taskTypes.find(t => t.id === todo.type);
  const priority = priorities.find(p => p.id === todo.priority);

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500"
  };

  const typeColors = {
    work: "bg-blue-500",
    personal: "bg-green-500",
    shopping: "bg-orange-500",
    health: "bg-red-500",
    learning: "bg-purple-500",
    other: "bg-gray-500"
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEdit(todo.id, {
        title: editedTitle,
        description: editedDescription,
        type: editedType,
        priority: editedPriority
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description || "");
    setEditedType(todo.type);
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-lightList dark:bg-darkList rounded-xl p-4 shadow-md">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full mb-2 p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements border border-lightPlaceHolder dark:border-darkPlaceHolder focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Titre de la tâche"
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="w-full mb-2 p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements border border-lightPlaceHolder dark:border-darkPlaceHolder focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Description (optionnel)"
          rows="2"
        />
        <div className="flex gap-2 mb-3">
          <select
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements border border-lightPlaceHolder dark:border-darkPlaceHolder focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {taskTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-light dark:bg-dark text-lightElements dark:text-darkElements border border-lightPlaceHolder dark:border-darkPlaceHolder focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>{priority.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-lightList dark:bg-darkList rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-lightPlaceHolder dark:border-darkPlaceHolder hover:border-green-500'
          }`}
        >
          {todo.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-lightElements dark:text-darkElements ${todo.completed ? 'line-through' : ''}`}>
              {todo.title}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-light dark:hover:bg-dark rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-lightPlaceHolder dark:text-darkPlaceHolder" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1.5 hover:bg-light dark:hover:bg-dark rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {todo.description && (
            <p className="text-sm text-lightPlaceHolder dark:text-darkPlaceHolder mb-2">
              {todo.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[todo.type]}`}>
              {taskType?.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${priorityColors[todo.priority]}`}>
              Priorité {priority?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { X } from "lucide-react";

export default function AddTodoDialog({ onAdd, onClose, taskTypes, priorities }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("personal");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        type,
        priority
      });
      setTitle("");
      setDescription("");
      setType("personal");
      setPriority("medium");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-light dark:bg-dark rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-lightElements dark:text-darkElements">
            Nouvelle Tâche
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-lightList dark:hover:bg-darkList rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-lightElements dark:text-darkElements" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-lightElements dark:text-darkElements mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Faire les courses"
              className="w-full p-3 rounded-lg bg-lightList dark:bg-darkList text-lightElements dark:text-darkElements placeholder:text-lightPlaceHolder dark:placeholder:text-darkPlaceHolder focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-lightElements dark:text-darkElements mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajouter des détails..."
              rows="3"
              className="w-full p-3 rounded-lg bg-lightList dark:bg-darkList text-lightElements dark:text-darkElements placeholder:text-lightPlaceHolder dark:placeholder:text-darkPlaceHolder focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-lightElements dark:text-darkElements mb-2">
              Type de tâche
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-lg bg-lightList dark:bg-darkList text-lightElements dark:text-darkElements focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {taskTypes.map(taskType => (
                <option key={taskType.id} value={taskType.id}>
                  {taskType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-lightElements dark:text-darkElements mb-2">
              Priorité
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    priority === p.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-lightList dark:bg-darkList text-lightElements dark:text-darkElements hover:bg-opacity-80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-lightList dark:bg-darkList text-lightElements dark:text-darkElements rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
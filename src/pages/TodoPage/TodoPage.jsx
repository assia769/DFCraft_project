import { useState } from "react";
import TodoList from "../../components/TodoList/TodoList";

export default function TodoPage() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="bg-light dark:bg-dark min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-8">
          <img 
            src="/icons/todo.png" 
            alt="Todo List" 
            className="w-64 h-64 object-contain opacity-80 dark:opacity-70"
          />
          <h1 className="text-4xl font-bold text-lightElements dark:text-darkElements text-center">
            Organisez vos tâches
          </h1>
          <p className="text-lg text-lightPlaceHolder dark:text-darkPlaceHolder text-center max-w-md">
            Gérez vos tâches quotidiennes avec efficacité et restez productif
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light dark:bg-dark min-h-screen">
      <TodoList />
    </div>
  );
}
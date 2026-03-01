import { useScrollTrigger } from "@mui/material";
import { useEffect, useState } from "react";

const Tasks = [
  {
    id: 1,
    title: "Task 1",
    completed: true,
  },
  {
    id: 2,
    title: "Task 2",
    completed: false,
  },
  {
    id: 3,
    title: "Task 3",
    completed: false,
  },
];

export default function EasyTasks() {
  const [tasks, setTasks] = useState([]);
  const [showListTasks, setShowListTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    setTasks(Tasks);
    setCompletedTasks(Tasks.filter((task) => task.completed).length);
  }, []);

  useEffect(() => {
    setCompletedTasks(tasks.filter((task) => task.completed).length);
  }, [tasks]);

  return (
    <div className="mx-14 mt-5">
      <div className="relative bg-lightElements dark:bg-darkElements px-4 py-2 rounded-full flex flex-row justify-between items-center cursor-pointer z-20" onClick={()=>{setShowListTasks(!showListTasks);}}>
        <p className="text-light dark:text-dark">Total completed tasks:</p>
        <div>
          <p className="text-light dark:text-dark">
            {completedTasks}/{tasks.length}
          </p>
        </div>
      </div>
      <div className={`bg-lightList dark:bg-darkList px-6 py-3 rounded-t-3xl rounded-b-lg shadow-lg z-0 overflow-hidden transition-all duration-300 ease-in-out ${
        showListTasks ? '-mt-9 pt-12 max-h-96 opacity-100' : 'mt-0 pt-0 max-h-0 opacity-0 py-0'
      }`}>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-1 flex flex-row justify-between items-center">
              <p className={`text-light dark:text-dark ${task.completed ? 'line-through opacity-80' : ''}`}>
                {task.title}
              </p>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={()=>{setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t));
                }}
                className="appearance-none mr-2 w-6 h-6 bg-transparent rounded-sm border-2 border-light dark:border-dark checked:before:content-['✓'] checked:before:w-full checked:before:h-full checked:before:text-light dark:checked:before:text-dark checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-2xl"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

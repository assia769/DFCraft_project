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

  function handleCountCompletedTasks() {
    return tasks.filter((task) => task.completed).length;
  }

  useEffect(() => {
    setTasks(Tasks);
    setCompletedTasks(handleCountCompletedTasks());

    if (tasks.length > 0) {
      // somting that i should do if the tasks are completed
    } else {
      // somting that i should do if the tasks are not completed
    }
  }, []);

  return (
    <div className="relative mx-14 mt-5">
      <div className="bg-lightElements dark:bg-darkElements px-4 py-2 rounded-full flex flex-row justify-between items-center cursor-pointer" onClick={()=>{setShowListTasks(!showListTasks);}}>
        <p className="text-light dark:text-dark">Total completed tasks:</p>
        <div>
          <p className="text-light dark:text-dark">
            {completedTasks}/{tasks.length}
          </p>
        </div>
      </div>
      <div className={`absolute top-full left-0 right-0 mt-2 bg-lightElements dark:bg-darkElements px-6 py-3 rounded-3xl shadow-lg z-10 overflow-hidden transition-all duration-300 ease-in-out ${
        showListTasks ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 py-0'
      }`}>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-1 flex flex-row justify-between items-center">
              <p className="text-light dark:text-dark">
                {task.title}
              </p>
              <input
                type="checkbox"
                onClick={()=>{setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t));
                setCompletedTasks(handleCountCompletedTasks());
                }}
                className="appearance-none mr-2 w-6 h-6 bg-transparent rounded-sm border-2 border-light dark:border-dark"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

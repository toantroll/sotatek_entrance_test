import { useState } from "react";
import CreateTask from "./components/createTask/CreateTask";
import ToDo from "./components/todo/ToDo";
import TaskContext from "./context/TaskContext";
import localStorage from "local-storage";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState(localStorage.get('tasks'));

  const context = {
    tasks: tasks,
    setTasks: setTasks
  }
  return (
    <TaskContext.Provider value={context}>
      <div className="screen-fragment left-side"><CreateTask /></div>
      <div className="screen-fragment right-side"><ToDo /></div>
    </TaskContext.Provider>
  );
}

export default App;

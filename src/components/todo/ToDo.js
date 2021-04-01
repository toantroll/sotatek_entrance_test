import { Fragment, useState, useContext, useEffect } from "react";
import TaskContext from "../../context/TaskContext";
import CreateTask from "../createTask/CreateTask";
import ToDoItem from "./ToDoItem";
import localStorage from "local-storage";
import './css/toDo.css';


const ToDo = (props) => {
    //init state
    const [tasks, setTasks] = useState(props.tasks);
    const [currentTasksSelected, setCurrentTasksSelected] = useState([]);
    const [searchTimer, setSearchTimer] = useState(null);

    useEffect(() => {
        setTasks(props.tasks);
    }, [props.tasks]);

    const toggleTaskSelect = (task, isSelected) => {
        if (isSelected) {
            currentTasksSelected.push(task);
        } else {
            const index = currentTasksSelected.findIndex(t => t.id === task.id);
            if (index > -1) {
                currentTasksSelected.splice(index, 1);
            }
        }
    }

    let ToDoList = [];
    if (tasks) {
        ToDoList = tasks.map(task => <ToDoItem key={task.id} task={task} toggleTaskSelect={toggleTaskSelect} />)
    }

    const removeBulkTasks = () => {
        //get origin tasks
        const tasks = localStorage.get("tasks");

        //remove task
        currentTasksSelected.forEach(currentTask => {
            const index = tasks.findIndex(t => t.id === currentTask.id)
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });

        //update context
        props.setTasks(tasks);
        //update local storage
        localStorage.set("tasks", tasks);
    }

    const searchTask = (e) => {
        const value = e.target.value;
        clearTimeout(searchTimer);
        //create time to reduce handle when input change
        const timer = setTimeout(function () {
            const newTodoList = props.tasks.filter(t => t.title.indexOf(value) > -1);
            setTasks(newTodoList);
        }, 200);

        setSearchTimer(timer);
    }

    return (
        <Fragment>
            <h1 className="todo-title">To Do List</h1>
            <input className="task-title" type="text" name="title" placeholder="Search ..." onChange={searchTask} />
            <ul className="todo-list">
                {ToDoList}
            </ul>
            <div className="bulk">
                <div class="action">
                    <button className="btn btn-done mr-25">Done</button>
                    <button className="btn btn-remove" onClick={removeBulkTasks}>Remove</button>
                </div>
            </div>
        </Fragment>
    );
}

const withTaskContext = (props) => {
    return (
        <TaskContext.Consumer>
            {(context) => {
                return <ToDo {...props} tasks={context.tasks} setTasks={context.setTasks} />
            }}
        </TaskContext.Consumer>
    )
};

export default withTaskContext;

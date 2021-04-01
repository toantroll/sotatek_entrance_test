import { useState } from "react";
import TaskContext from "../../context/TaskContext";
import CreateTask from "../createTask/CreateTask";
import localStorage from "local-storage";

const ToDoItem = (props) => {
    //init state
    const [showDetail, setShowDetail] = useState(false);
    const [isSelected, toggleSelected] = useState(false);

    const toggleShowDetail = () => {
        setShowDetail(!showDetail);
    }
    const removeTask = () => {
        const tasks = localStorage.get("tasks");
        const index = tasks.findIndex(t => t.id === props.task.id)
        if (index > -1) {
            tasks.splice(index, 1);
            props.setTasks(tasks);
            //update local storage
            localStorage.set("tasks", tasks);
        }
    }

    const toggleSelect = () => {
        const newState = !isSelected;
        toggleSelected(newState)
        props.toggleTaskSelect(props.task, newState);
    }

    return (
        <li>
            <div className="item">
                <input className="todo-checkbox" id={'cb'+props.task.id} type="checkbox" onChange={toggleSelect} />
                <label className="todo-item-infor" htmlFor={'cb'+props.task.id}>{props.task.title}</label>
                <div className="todo-item-action">
                    <button className="btn btn-detail" onClick={toggleShowDetail}>detail</button>
                    <button className="btn btn-remove" onClick={removeTask}>remove</button>
                </div>
                <div className="clear-fix"></div>
            </div>
            <div style={{ display: showDetail ? 'block' : 'none' , margin : '5px'}}>
                <CreateTask task={props.task} />
            </div>
        </li>
    );
}
const withTaskContext = (props) => {
    return (
        <TaskContext.Consumer>
            {(context) => {
                return <ToDoItem {...props} tasks={context.tasks} setTasks={context.setTasks} />
            }}
        </TaskContext.Consumer>
    )
};

export default withTaskContext;

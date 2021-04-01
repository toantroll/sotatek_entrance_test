
import { Fragment, useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import localStorage from "local-storage";
import TaskContext from "../../context/TaskContext";
import "./css/createTask.css";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = (props) => {

    //init state
    const [dueDate, setDueDate] = useState(new Date());
    //init ref
    const taskRef = useRef();
    useEffect(() => {
        loadFormDefaultValue(props.task);
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const form = taskRef.current;
        //title validation
        if (!form.title.value) {
            alert("fill title");
            return;
        }
        //due date validation
        const currentDate = new Date(new Date);
        currentDate.setHours(0, 0, 0, 0);
        if (!form.dueDate.value || currentDate > new Date(form.dueDate.value)) {
            alert("Do not accept days in past");
            return;
        }

        //create model
        const task = {
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            priority: form.priority.value,
        }
        if (props.task) {
            updateTask(task);
        } else {
            createNewTask(task);
        }
    }

    const createNewTask = (task) => {
        task.id = Date.now();
        //save to local storage
        let tasks = localStorage.get("tasks");
        if (!tasks) {
            tasks = [];
        }
        tasks.sort(function(a,b){
            return new Date(a.dueDate) - new Date(b.dueDate);
          });
        tasks.push(task);
        localStorage.set("tasks", tasks);
        //set to context
        props.setTasks(tasks);
        loadFormDefaultValue();
    }

    const updateTask = (task) => {
        task.id = props.task.id;
        //update in local store
        let tasks = localStorage.get("tasks");
        tasks.sort(function(a,b){
            return new Date(a.dueDate) - new Date(b.dueDate);
          });
        const index = tasks.findIndex(t => t.id === task.id);
        if (index > -1) {
            tasks[index] = task;
        }
        localStorage.set("tasks", tasks);
        //set to context
        props.setTasks(tasks);
    }

    const loadFormDefaultValue = () => {
        const form = taskRef.current;
        if (props.task) {
            form.title.value = props.task.title;
            form.description.value = props.task.description;
            form.priority.value = props.task.priority;
            setDueDate(new Date(props.task.dueDate));
        } else {
            form.title.value = "";
            form.description.value = "";
            form.priority.value = "normal";
            setDueDate(new Date());
        }

    }

    return (
        <div className="task-wraper">
            {props.task ? '' : <h1 className="create-task-header">New Task</h1>}
            <form ref={taskRef} onSubmit={onSubmit}>
                <input className="task-title" type="text" name="title" placeholder="Add new task ..." />
                <div className="task-description mt-15">
                    <label className="label">Description</label>
                    <textarea name="description" />
                </div>
                <div className="task-due-date mt-15">
                    <label className="label">Due Date</label>
                    <DatePicker name="dueDate" selected={dueDate} onChange={date => setDueDate(date)} />
                </div>
                <div className="task-priority mt-15">
                    <label className="label">Priority</label>
                    <select name="priority">
                        <option value="low">low</option>
                        <option value="normal">normal</option>
                        <option value="high">high</option>
                    </select>
                </div>
                <button className="btn-add mt-15">{props.task ? "Update" : "Add"}</button>
            </form>
        </div>
    );

}

const withTaskContext = (props) => {
    return (
        <TaskContext.Consumer>
            {(context) => {
                return <CreateTask {...props} setTasks={context.setTasks} />
            }}
        </TaskContext.Consumer>
    )
};

export default withTaskContext;
import {createContext} from 'react';

const taskContext = createContext({
    tasks:[],
    setTasks: ()=> {}
});

export default taskContext;
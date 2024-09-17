import "./style.css";
import { format } from 'date-fns';
import { renderWorkspace, populateProjects } from "./renderDOM.js";

class CreateToDo {
    constructor(title, description, dueDate, priority, notes, completed, project) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = completed;
        this.project = project;
    }
}

class CreateProject {
    constructor(name) {
        this.name = name;
        this.toDos = [];
    }
}

const init = (() => {
    const storage = window['localStorage'];

    let data = [];

    if (!storage.getItem('data')) {
        const defaultProject = new CreateProject('');
        data.push(defaultProject);
        storage.setItem('data', JSON.stringify(data));
    }
    else {
        data = JSON.parse(storage.getItem('data'));
    }

    return { data, storage };
})();

function addToLocalStorage(title, description, dueDate, priority, notes, completed, project, data) {

    if (data.find(item => item.name === project)) {
        let index = data.indexOf(data.find(item => item.name === project));
        data[index].toDos.push(new CreateToDo(title, description, dueDate, priority, notes, completed, project));
    }
    else {
        data.push(new CreateProject(project));
        let index = data.indexOf(data.find(item => item.name === project));
        data[index].toDos.push(new CreateToDo(title, description, dueDate, priority, notes, completed, project));
    }

    init.storage.setItem('data', JSON.stringify(data));

    return data;
}

// addToLocalStorage('brush teeth', 'floss and brush teeth', format(new Date(2024, 8, 8), "yyyy-MM-dd"), 'Urgent!', 'do this at night and not during the day', 'Yes', 'health', init.data);
// addToLocalStorage('work on Odin', 'continue to work on The Odin Project', format(new Date(2025, 8, 8), "yyyy-MM-dd"), 'High', 'self learning to get a web dev job', 'No', 'work', init.data);
// addToLocalStorage('go to work', 'i work at Dollar Tree', format(new Date(2024, 8, 9), "yyyy-MM-dd"), 'High', 'i am an assistant store manager at the Red Bank Dollar Tree', 'No', 'work', init.data);
// addToLocalStorage('write Mom\'s birthday card', 'finish Mom\'s birthday gift', format(new Date(2024, 8, 18), "yyyy-MM-dd"), 'Medium', 'Mom\'s birthday is coming up on the lunar calendar', 'No', 'family', init.data);
// addToLocalStorage('play Black Myth: Wukong', 'relax by playing a video game', format(new Date(2024, 11, 30), "yyyy-MM-dd"), 'Backburner', 'Black Myth: Wukong is a Chinese video game that was recently released', 'No', '', init.data);

populateProjects();
renderWorkspace();

export { init, CreateToDo, CreateProject };
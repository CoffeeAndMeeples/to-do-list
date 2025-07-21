import "./styles.css";
import { clearTasks, displayProjects, makeProjectClickable, activateProjectCheckbox, displayTasks } from "./dom.js";

export let userProjects = [];
retrieveArray("userProjectsArray");

class Project {
    constructor(name, description, due, priority) {
        this.name = name;
        this.tasks = [];
        this.description = description;
        this.due = due;
        this.priority = priority;
        this.id = makeKebab(name);
        this.selected = "False";
        this.complete = "False";
    }
}

class Task {
    constructor(name) {
        this.name = name;
        this.complete = "False";
        this.id = makeKebab(name);
    }
}

//use "userProjectsArray as the key for storing and retrieving userProjects"

//function to update local storage with userProjects
export function storeArray(key, array) {
    try {
        const jsonString = JSON.stringify(array);
        localStorage.setItem(key, jsonString);
        console.log(jsonString)
    } catch (error) {
        console.error('Error storing array in local storage: ${error}');
    }
}

//function to look for data in local storage when page is first loaded
function retrieveArray(key) {
    console.log(userProjects);
    console.log(JSON.parse(localStorage.getItem(key)));
    if (JSON.parse(localStorage.getItem(key)) !== null) {
        userProjects = JSON.parse(localStorage.getItem(key));
        console.log(userProjects);
    }
}
if (userProjects.length === 0) {
    const defaultProject = new Project("Default Project");
    userProjects.push(defaultProject);
}
displayProjects(userProjects);
for (const project of userProjects) {
    updateTaskForm(project);
}

// project form section
projectFormListener(userProjects);

function makeKebab(string) {
    const kebabed = string.replaceAll(' ', '-');
    return kebabed;
}

function projectFormListener(projectList) {
    document.addEventListener('DOMContentLoaded', function() {
        const myForm = document.querySelector("#new-project");
        myForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(myForm);
            //handle exception where project already exists
            for (const project of userProjects) {
                if (project.name === formData.get("name")) {
                    alert("A Project with that name already exists.");
                    return;
                }
            }
            //name, description, due, priority
            const name = formData.get("name");
            const description = formData.get("description");
            const due = formData.get("due");
            const priority = formData.get("priority");
            const newProject = new Project(name, description, due, priority);
            userProjects.push(newProject);
            storeArray("userProjectsArray", userProjects);

            displayProjects(projectList);
            //update add task dropdown
            updateTaskForm(newProject);
        })
    })
}
// task form section
const taskForm = document.querySelector("#new-task");
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const newTask = new Task(formData.get("name"));
    //loop through userProjects and find the project that matches
    for (const item of userProjects) {
        console.log(formData.get("project"));
        if (item.name === formData.get("project")) {
            item.tasks.push(newTask);
            storeArray("userProjectsArray", userProjects);
            const projectToDeselect = document.getElementById(item.id + "-checkbox");
            projectToDeselect.checked = false;
            
            //check to see if selected project is active project
            const currentProject = document.querySelector(".selected");
            if (currentProject === null) {
                return
            }
            else {
                //if it is, update tasks with found node
                if (item.name === formData.get("project")) {
                    displayTasks(currentProject);
                }
            }
        }
    }

})

function updateTaskForm(project) {
    const newProject = document.createElement("option");
    newProject.value = project.name;
    newProject.textContent = project.name;
    const dropdown = document.querySelector("#project");
    dropdown.appendChild(newProject);

}

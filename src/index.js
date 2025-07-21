import "./styles.css";
import { clearTasks, displayProjects, makeProjectClickable, activateProjectCheckbox } from "./dom.js";

 export const userProjects = [];
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

//function to convert name to kebab type to eliminate any spaces

const defaultProject = new Project("Default Project");
userProjects.push(defaultProject);
displayProjects(userProjects);
updateTaskForm(defaultProject);

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

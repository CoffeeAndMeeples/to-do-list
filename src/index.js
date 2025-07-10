import "./styles.css";

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.selected = "False";
    }
}

class Task {
    constructor(name) {
        this.name = name;
        this.complete = "False";
    }
}
//global variable to hold all of users projects
const userProjects = [];
const defaultProject = new Project("default project");
userProjects.push(defaultProject);
displayProjects(userProjects);
updateTaskForm(defaultProject);

const myForm = document.querySelector("#new-project");
myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(myForm);
    const newProject = new Project(formData.get("name"));
    userProjects.push(newProject);

    displayProjects(userProjects);
    //update add task dropdown
    updateTaskForm(newProject);
})

const taskForm = document.querySelector("#new-task");
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const newTask = new Task(formData.get("name"));
    //loop through userProjects and find the project that matches
    for (const item of userProjects) {
        if (item.name === formData.get("project")) {
            item.tasks.push(newTask);
            console.log(item.tasks);
            //check to see if selected project is active project
            const currentProject = document.querySelector(".selected");

            //if it is, update tasks with found node
            if (currentProject !== null && currentProject.textContent === formData.get("project")) {
                displayTasks(currentProject);
            }
        }
    }

})
//display projects function
function displayProjects(projectList) {
    //grap the projects div
    const parentNode = document.querySelector(".projects");
    //create an array of all existing project names displayed in parentNode
    const currentlyDisplayedProjects = [];
    const projects = document.querySelectorAll(".projects > *");
    
    projects.forEach(project => {
        currentlyDisplayedProjects.push(project.textContent);
    })
    console.log(currentlyDisplayedProjects);
    
    //put all the projects in the div
    projectList.forEach(element => {
        //compare against currentlyDisplayedProjects
        if (!currentlyDisplayedProjects.includes(element.name)) {
            const newDiv = document.createElement("div");
            newDiv.textContent = element.name;
            makeProjectClickable(newDiv);
            parentNode.appendChild(newDiv);
        }
    });
}
function makeProjectClickable(node) {
    node.addEventListener("click", (event) => {
        //grab the currently selected project
        const currentlySelected = document.querySelector(".selected");
        //remove selected class
        if (currentlySelected !== null) {
        currentlySelected.classList.remove('selected');
        }
        
        //add 'selected' to the clicked node
        node.classList.add('selected');
        displayTasks(node);
    })
}

function updateTaskForm(project) {
    const newProject = document.createElement("option");
    newProject.value = project.name;
    newProject.textContent = project.name;
    const dropdown = document.querySelector("#project");
    dropdown.appendChild(newProject);

}
// project node as the argument use the text to find the project from userProjects
// and then create a task node for each task in selected project
function displayTasks(node) {
    const parentNode = document.querySelector(".tasks");
    //clear existing children
    while (parentNode.children.length > 1) {
        parentNode.removeChild(parentNode.lastChild);
    }

    for (const project of userProjects) {
        if (project.name === node.textContent) {
            for (const task of project.tasks) {
                const newNode = document.createElement("div");
                newNode.textContent = task.name;
                parentNode.appendChild(newNode);
            }
        }
    }
}
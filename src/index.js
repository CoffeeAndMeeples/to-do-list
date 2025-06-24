import "./styles.css";

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }
}

class Task {
    constructor(name, priority, dueDate, description, notes) {
        this.name = name;
        this.priority = priority;
        this.dueDate = dueDate;
        this.description = description;
        this.notes = notes;
        this.complete = "False";
    }
}
//global variable to hold all of users projects
const userProjects = [];
const defaultProject = new Project("default project");
userProjects.push(defaultProject);
displayProjects(userProjects);

const myForm = document.querySelector("#new-project");
myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(myForm);
    const newProject = new Project(formData.get("name"));
    userProjects.push(newProject);

    displayProjects(userProjects);
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

            parentNode.appendChild(newDiv);
        }
    });
}
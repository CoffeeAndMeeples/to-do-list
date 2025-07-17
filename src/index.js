import "./styles.css";

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
function makeKebab(string) {
    const kebabed = string.replaceAll(' ', '-');
    return kebabed;
}
//global variable to hold all of users projects
const userProjects = [];
const defaultProject = new Project("Default Project");
userProjects.push(defaultProject);
displayProjects(userProjects);
updateTaskForm(defaultProject);

// project form section
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

    displayProjects(userProjects);
    //update add task dropdown
    updateTaskForm(newProject);
})

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
//display projects function
function displayProjects(projectList) {
    //grab the projects div
    const parentNode = document.querySelector(".projects");
    //create an array of all existing project names displayed in parentNode
    const currentlyDisplayedProjects = [];
    const projects = document.querySelectorAll(".projects > *");
    
    projects.forEach(project => {
       const projectId = project.id;
        currentlyDisplayedProjects.push(projectId);
    });
    
    //put all the projects in the div
    projectList.forEach(element => {
        //compare against currentlyDisplayedProjects
        if (!currentlyDisplayedProjects.includes(element.id)) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("project-container");
            newDiv.classList.add(element.id);
            newDiv.id = element.id;
            const newLabel = document.createElement("label");
            newLabel.for = element.id + "-checkbox";
            newLabel.textContent = element.name;
            const newInput = document.createElement("input");
            newInput.type = "checkbox";
            newInput.id = element.id + "-checkbox";
            newInput.name = element.id + "-checkbox";
            newDiv.appendChild(newInput);
            newDiv.appendChild(newLabel);
            makeProjectClickable(newDiv);
            parentNode.appendChild(newDiv);
            activateProjectCheckbox(newInput, element);
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
        //delete all the child nodes of previously selected, except the label and checkbox
        while (currentlySelected.children.length > 2) {
            currentlySelected.removeChild(currentlySelected.lastChild);
        }
        }
        //if user has selected the currently selected node-escape function(making the click minimize details)
        if (currentlySelected === node) {
            //clear tasks
            clearTasks();
            return;
        }
        //else populate the node with children that hold the project's details
        else {
            loadProjectDetails(node);
            
            //add 'selected' to the clicked node
            node.classList.add('selected');
            displayTasks(node);
        }
        
    })
}

function updateTaskForm(project) {
    const newProject = document.createElement("option");
    newProject.value = project.name;
    newProject.textContent = project.name;
    const dropdown = document.querySelector("#project");
    dropdown.appendChild(newProject);

}

function clearTasks() {
    const parentNode = document.querySelector(".tasks");
    //clear existing children 
    //leave the first child as it's the label for the node
    while (parentNode.children.length > 1) {
        parentNode.removeChild(parentNode.lastChild);
    }
}
// project node as the argument use the text to find the project from userProjects
// and then create a task node for each task in selected project
function displayTasks(node) {
    clearTasks();
    const parentNode = document.querySelector(".tasks");

    for (const project of userProjects) {
  
        if (project.id === node.id) {
            for (const task of project.tasks) {
                const newNode = document.createElement("div");
                newNode.id = task.id;
                newNode.classList.add("task-container");
                const newLabel = document.createElement("label");
                newLabel.for = task.id + "-checkbox";
                newLabel.textContent = task.name;
                const newInput = document.createElement("input");
                newInput.type = "checkbox";
                newInput.id = task.id + "-checkbox";
                newInput.name = task.id + "-checkbox";
                //tick checkbox if task.complete is true
                if (task.complete === "True") {
                    newInput.checked = true;
                }
                newNode.appendChild(newInput);
                newNode.appendChild(newLabel);
                parentNode.appendChild(newNode);
                activateTaskCheckbox(newInput, task, project);
            }
            project.selected = "True";
            
        }
        else {
            project.selected = "False";
        }
    }
}
//load a node that is the title of a project with all of it's deatails in a child node
function loadProjectDetails(node) {
    //create the elements
    const container = document.createElement("div");
    const description = document.createElement("p");
    const due = document.createElement("p");
    const priority = document.createElement("p");
    //get the project from userProjects
    for (const project of userProjects) {
        if (node.classList.contains(project.id)) {
            description.textContent = "Description: " + project.description;
            due.textContent = "Due Date: " + project.due;
            priority.textContent = "Priority: " + project.priority;
        }
    }
    container.appendChild(description);
    container.appendChild(due);
    container.appendChild(priority);
    node.appendChild(container);
}

function activateTaskCheckbox(checkboxNode, task, project) {
    checkboxNode.addEventListener("click", (event) => {
        const checkbox = document.getElementById(project.id + "-checkbox");
        //if box is unchecked, set task.complete to "False" 
        if (checkboxNode.checked) {
            task.complete = "True";
        }
        else {
            task.complete = "False";
            checkbox.checked = false;
        }
        let tasksComplete = "True";
        for (const task of project.tasks) {
            if (task.complete === "False") {
                tasksComplete = "False";
            }
        }
        if (tasksComplete === "True") {
            //get the project checkbox and set it to checked, set project.complete to true
            checkbox.checked = true;

        }
    })

}
function activateProjectCheckbox(checkboxNode, project) {
    checkboxNode.addEventListener("change", (event) => {
        //if box is unchecked, set project.complete to "False" 
        if (checkboxNode.checked) {
            project.complete = "True";
            console.log(project);
        }
        else {
            project.complete = "False";
            console.log(project);
        }
    })

}
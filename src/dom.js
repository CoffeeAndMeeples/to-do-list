import { userProjects, storeArray } from "./index.js";

export function clearTasks() {
    const parentNode = document.querySelector(".tasks");
    //clear existing children 
    //leave the first child as it's the label for the node
    while (parentNode.children.length > 1) {
        parentNode.removeChild(parentNode.lastChild);
    }
}
export function clearProjects() {
    const parentNode = document.querySelector(".projects");
    //clear existing children 
    //leave the first child as it's the label for the node
    while (parentNode.children.length > 1) {
        parentNode.removeChild(parentNode.lastChild);
    }
}

//display projects function
export function displayProjects(projectList) {

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
            if (element.complete === "True") {
                newInput.checked = true;
            }
            const newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.classList.add("delete-button");
            newDeleteButton.classList.add(element.id);
            newDeleteButton.value = "Delete";
            
            newDiv.appendChild(newInput);
            newDiv.appendChild(newLabel);
            newDiv.appendChild(newDeleteButton);
            makeProjectClickable(newDiv);
            parentNode.appendChild(newDiv);
            activateProjectCheckbox(newInput, element);
            activateProjectDeleteButton(newDeleteButton);
        }
    });
}

export function makeProjectClickable(node) {
    node.addEventListener("click", (event) => {
        //grab the currently selected project
        const currentlySelected = document.querySelector(".selected");
        //remove selected class
        if (currentlySelected !== null) {
        currentlySelected.classList.remove('selected');
        //delete all the child nodes of previously selected, except the label and checkbox
        while (currentlySelected.children.length > 3) {
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

function activateProjectCheckbox(checkboxNode, project) {
    checkboxNode.addEventListener("change", (event) => {
        //if box is unchecked, set project.complete to "False" 
        if (checkboxNode.checked) {
            project.complete = "True";
            storeArray("userProjectsArray", userProjects);
        }
        else {
            project.complete = "False";
            storeArray("userProjectsArray", userProjects);
        }
    })

}

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

// project node as the argument use the text to find the project from userProjects
// and then create a task node for each task in selected project
export function displayTasks(node) {
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
                const newDeleteButton = document.createElement("input");
                newDeleteButton.type = "button";
                newDeleteButton.classList.add("delete-button");
                newDeleteButton.classList.add(task.id);
                newDeleteButton.value = "Delete";
                newNode.appendChild(newInput);
                newNode.appendChild(newLabel);
                newNode.appendChild(newDeleteButton);
                parentNode.appendChild(newNode);
                activateTaskCheckbox(newInput, task, project);
                activateTaskDeleteButton(newDeleteButton);
            }
            project.selected = "True";
            //update local storage
            storeArray("userProjectsArray", userProjects);
            
        }
        else {
            project.selected = "False";
            //update local storage
            storeArray("userProjectsArray", userProjects);
        }
    }
}

//load a node that is the title of a project with all of it's deatails in a child node
function activateTaskCheckbox(checkboxNode, task, project) {
    checkboxNode.addEventListener("click", (event) => {
        const checkbox = document.getElementById(project.id + "-checkbox");
        //if box is unchecked, set task.complete to "False" 
        if (checkboxNode.checked) {
            task.complete = "True";
            storeArray("userProjectsArray", userProjects);
        }
        else {
            task.complete = "False";
            storeArray("userProjectsArray", userProjects);
            checkbox.checked = false;
        }
        let tasksComplete = "True";
        for (const task of project.tasks) {
            if (task.complete === "False") {
                tasksComplete = "False";
                storeArray("userProjectsArray", userProjects);
            }
        }
        if (tasksComplete === "True") {
            //get the project checkbox and set it to checked, set project.complete to true
            project.complete = "True";
            checkbox.checked = true;
            storeArray("userProjectsArray", userProjects);

        }
    })

}

function activateProjectDeleteButton(node) {
    node.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        //find the project in the project list and delete it
        for (let i = 0; i < userProjects.length; i++) {
            if (node.classList.contains(userProjects[i].id)) {
                // delete the node
                deleteNode(userProjects[i].id);
                //delete the project form userProjects
                userProjects.splice(i, 1);
                //update local storage
                storeArray("userProjectsArray", userProjects);

            }
        }
    })
}
function activateTaskDeleteButton(node) {
    node.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        //find the task in the project list and delete it
        for (const project of userProjects) {
            for (let i = 0; i < project.tasks.length; i++) {
                if (node.parentNode.id === project.tasks[i].id) {
                // delete the node
                deleteNode(project.tasks[i].id);
                //delete the project form userProjects
                project.tasks.splice(i,1);
                
                //update local storage
                storeArray("userProjectsArray", userProjects);
                }
            }
        }
    })
}

function deleteNode(id) {
    const nodeToDelete = document.querySelector("#" + id);
    if (nodeToDelete.classList.contains("selected")) {
        clearTasks();
    }
    nodeToDelete.remove();
}
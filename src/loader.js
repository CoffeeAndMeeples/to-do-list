function initialPageLoad() {
    projectButton();
    loadProjects();
    addProjectListener();
}

function loadProjects(projects) {
    const projectsDiv = document.querySelector("#projects");
    //loop through the array of projects
    for (item in projects) {
        const newDiv = document.createElement("div");
        newDiv.textContent = item.name;
        projectsDiv.appendChild(newDiv);
    }

    //create a div for each one and populate it with project information
}


//create a project button to add new projects to the main user


function addProjectListener() {
    const btn =

}
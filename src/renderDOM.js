import editSvg from "./playlist-edit.svg";
import delSvg from "./delete-outline.svg";
import eyeSvg from "./eye-outline.svg";
import closeSvg from "./window-close.svg";
import checkSvg from "./checkbox-marked-outline.svg";
import uncheckSvg from "./checkbox-blank-outline.svg";
import { init, CreateToDo, CreateProject } from "./index.js"

function renderWorkspace() {
    const newToDo = document.querySelector('.newToDo');
    const addDialog = document.querySelector('.addDialog');
    const addForm = document.querySelector('.addForm');
    const cancelToDo = document.getElementById('cancelBtnAdd');
    const submitToDo = document.getElementById('confirmBtnAdd');

    cancelToDo.addEventListener('click', () => {
        addForm.reset();
        addDialog.style.display = `none`;
        addDialog.close();
    })

    submitToDo.addEventListener('click', (event) => {
        event.preventDefault();

        const title = addDialog.querySelector('.title').value;
        const desc = addDialog.querySelector('.desc').value;
        const dueDate = addDialog.querySelector('.date').value;
        const priority = addDialog.querySelector('.priority').value;
        const notes = addDialog.querySelector('.notes').value;
        const completed = addDialog.querySelector('.completed').value;
        const project = addDialog.querySelector('.project').value;

        const newToDo = new CreateToDo(title, desc, dueDate, priority, notes, completed, project);
        addToDo(newToDo, init.storage);

        populateProjects();
        setSelected(project);
        populateProjects();

        addForm.reset();
        addDialog.style.display = `none`;
        addDialog.close();
    })

    newToDo.addEventListener('click', () => {
        addDialog.style.display = `flex`;
        addDialog.showModal();
    })

    const newProject = document.querySelector('.newProject');
    const body = document.querySelector('body');

    const addEditProject = document.createElement('dialog');
    addEditProject.classList.add('addEditProject');
    const projectDialogTitle = document.createElement('span');
    projectDialogTitle.textContent = `Add a new project`;
    projectDialogTitle.classList.add('projectDialogTitle');

    const addEditForm = document.createElement('form');

    const projectName = document.createElement('div');
    projectName.classList.add('formElement');
    const projectLabel = document.createElement('label');
    projectLabel.textContent = `Project name: `;
    const projectInput = document.createElement('input');
    projectInput.type = 'text';
    projectInput.classList.add('title');
    projectInput.classList.add('field');
    projectInput.name = 'title';
    projectInput.id = 'addEditProjectInput';
    projectInput.autofocus = true;
    projectLabel.appendChild(projectInput);
    projectName.appendChild(projectLabel);

    const projectButtonsDiv = document.createElement('div');
    projectButtonsDiv.classList.add('dialogButtonDiv');

    const projectConfirm = document.createElement('button');
    projectConfirm.classList.add('dialogButton');
    projectConfirm.id = 'projectConfirmBtn';
    projectConfirm.value = 'default';
    projectConfirm.type = 'submit';
    projectConfirm.textContent = 'OK';
    projectConfirm.style.color = `black`;

    const projectCancel = document.createElement('button');
    projectCancel.classList.add('dialogButton');
    projectCancel.id = 'projectCancelBtn';
    projectCancel.value = 'cancel';
    projectCancel.type = 'button';
    projectCancel.textContent = 'Cancel';
    projectCancel.formMethod = 'dialog';

    projectButtonsDiv.appendChild(projectConfirm);
    projectButtonsDiv.appendChild(projectCancel);

    addEditForm.appendChild(projectName);

    addEditProject.appendChild(projectDialogTitle);
    addEditProject.appendChild(addEditForm);
    addEditProject.appendChild(projectButtonsDiv);

    body.appendChild(addEditProject);

    projectConfirm.addEventListener('click', (event) => {
        event.preventDefault();

        addProject(projectInput.value, init.storage);

        populateProjects();

        addEditForm.reset()
        addEditProject.style.display = `none`;
        addEditProject.close();
    })

    projectCancel.addEventListener('click', (event) => {
        event.preventDefault();
        addEditForm.reset()
        addEditProject.style.display = `none`;
        addEditProject.close();
    })

    newProject.addEventListener('click', () => {
        addEditProject.style.display = 'flex';
        addEditProject.showModal();
    });
}

function populateCards(list) {
    const workspace = document.querySelector('.workspace');
    if (document.querySelector('.cardContainer')) {
        document.querySelector('.cardContainer').remove();
    }
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('cardContainer');
    workspace.appendChild(cardContainer);
    const body = document.querySelector('body');

    const currList = getCurrToDos(list, init.storage);

    if (currList) {
        for (const item of currList) {
            for (const toDo of item.toDos) {
                const card = document.createElement('div');
                card.classList.add('card');
                const cardText = document.createElement('div');
                cardText.classList.add('cardText');
                const title = document.createElement('div');
                title.classList.add('cardElement');
                const desc = document.createElement('div');
                desc.classList.add('cardElement');
                const dueDate = document.createElement('div');
                dueDate.classList.add('cardElement');
                const priority = document.createElement('div');
                priority.classList.add('cardElement');
                const notes = document.createElement('div');
                notes.classList.add('cardElement');
                const completed = document.createElement('div');
                completed.classList.add('cardElement');
                const project = document.createElement('div');
                project.classList.add('cardElement');

                cardText.appendChild(title);
                cardText.appendChild(desc);
                cardText.appendChild(dueDate);
                cardText.appendChild(priority);
                cardText.appendChild(notes);
                cardText.appendChild(completed);
                cardText.appendChild(project);

                card.appendChild(cardText);

                title.textContent = toDo.title;
                dueDate.textContent = `Due: ${toDo.dueDate}`;
                switch (toDo.priority) {
                    case ('Urgent!'): {
                        card.style.backgroundColor = 'red';
                        break;
                    }
                    case ('High'): {
                        card.style.backgroundColor = 'orange';
                        break;
                    }
                    case ('Medium'): {
                        card.style.backgroundColor = 'yellow';
                        break;
                    }
                    case ('Low'): {
                        card.style.backgroundColor = 'blue';
                        break;
                    }
                    case ('Backburner'): {
                        card.style.backgroundColor = 'green';
                        break;
                    }
                }
                notes.textContent = toDo.notes;
                if (toDo.completed === 'Yes') {
                    card.classList.add('completedCard');
                }
                else if (toDo.completed === 'No') {
                    card.classList.remove('completedCard');
                }

                const edit = document.createElement('img');
                const del = document.createElement('img');
                const view = document.createElement('img');
                const checked = document.createElement('img');
                const unchecked = document.createElement('img');
                checked.src = checkSvg;
                unchecked.src = uncheckSvg;
                edit.src = editSvg;
                del.src = delSvg;
                view.src = eyeSvg;
                view.classList.add('cardIcon');
                view.classList.add('viewIcon');
                edit.classList.add('cardIcon');
                edit.classList.add('editIcon');
                del.classList.add('cardIcon');
                del.classList.add('delIcon');
                checked.classList.add('cardIcon');
                checked.classList.add('check');
                unchecked.classList.add('cardIcon');
                unchecked.classList.add('uncheck');
                const iconContainer = document.createElement('div')
                iconContainer.classList.add('iconContainer');
                if (toDo.completed === 'Yes') {
                    unchecked.remove();
                    iconContainer.appendChild(checked);
                }
                else {
                    checked.remove();
                    iconContainer.appendChild(unchecked);
                }
                iconContainer.appendChild(view);
                iconContainer.appendChild(edit);
                iconContainer.appendChild(del);
                card.appendChild(iconContainer);

                cardContainer.appendChild(card);

                checked.addEventListener('click', (event) => {
                    const data = JSON.parse(init.storage.getItem('data'));
                    let index = data.indexOf(data.find(entry => entry.name === item.name));
                    for (let dataToDo of data[index].toDos) {
                        if (dataToDo.title === toDo.title && dataToDo.description === toDo.description && dataToDo.dueDate === toDo.dueDate && dataToDo.priority === toDo.priority && dataToDo.notes === toDo.notes) {
                            dataToDo.completed = 'No';
                        }
                    }
                    init.storage.setItem('data', JSON.stringify(data));
                    const selected = getSelectedProjects();
                    populateCards(selected);
                    event.currentTarget.parentElement.insertBefore(unchecked, view);
                    event.currentTarget.remove();
                })

                unchecked.addEventListener('click', (event) => {
                    const data = JSON.parse(init.storage.getItem('data'));
                    let index = data.indexOf(data.find(entry => entry.name === item.name));
                    for (let dataToDo of data[index].toDos) {
                        if (dataToDo.title === toDo.title && dataToDo.description === toDo.description && dataToDo.dueDate === toDo.dueDate && dataToDo.priority === toDo.priority && dataToDo.notes === toDo.notes) {
                            dataToDo.completed = 'Yes';
                        }
                    }
                    init.storage.setItem('data', JSON.stringify(data));
                    const selected = getSelectedProjects();
                    populateCards(selected);
                    event.currentTarget.parentElement.insertBefore(checked, view);
                    event.currentTarget.remove();
                })

                const deleteDialog = document.createElement('dialog');
                deleteDialog.classList.add('deleteToDo');
                const dialogText = document.createElement('p');
                dialogText.textContent = `Are you sure you want to delete this item?`;
                const dialogButtonDiv = document.createElement('div');
                dialogButtonDiv.classList.add('dialogButtonDiv');
                const confirm = document.createElement('button');
                confirm.classList.add('dialogButton');
                confirm.textContent = `OK`;
                confirm.style.color = `black`;
                const cancel = document.createElement('button');
                cancel.classList.add('dialogButton');
                cancel.type = `button`;
                cancel.textContent = `Cancel`;

                cancel.addEventListener('click', () => {
                    card.style.opacity = `1`;
                    card.style.transition = `0.5s`;
                    deleteDialog.style.display = `none`;
                    deleteDialog.close();
                })

                confirm.addEventListener('click', () => {
                    deleteToDo(toDo, init.storage);

                    card.remove();

                    populateProjects();

                    deleteDialog.style.display = `none`;
                    deleteDialog.close();
                })

                deleteDialog.appendChild(dialogText);
                deleteDialog.appendChild(dialogButtonDiv);
                dialogButtonDiv.appendChild(confirm);
                dialogButtonDiv.appendChild(cancel);
                body.appendChild(deleteDialog);

                const editDialog = document.createElement('dialog');
                editDialog.classList.add('editDialog');
                const editTitle = document.createElement('span');
                editTitle.textContent = `Edit To Do`;
                editTitle.classList.add('toDoTitle');

                const editForm = document.createElement('form');

                const titleDiv = document.createElement('div');
                titleDiv.classList.add('formElement');
                const titleLabel = document.createElement('label');
                titleLabel.textContent = `Title: `;
                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.classList.add('title');
                titleInput.classList.add('field');
                titleInput.name = 'title';
                titleInput.id = 'titleEdit';
                titleInput.autofocus = true;
                titleLabel.appendChild(titleInput);
                titleDiv.appendChild(titleLabel);

                const descDiv = document.createElement('div');
                descDiv.classList.add('formElement');
                const descLabel = document.createElement('label');
                descLabel.textContent = `Description: `;
                const descInput = document.createElement('textarea');
                descInput.classList.add('desc');
                descInput.classList.add('field');
                descInput.name = 'desc';
                descInput.id = 'descEdit';
                descLabel.appendChild(descInput);
                descDiv.appendChild(descLabel);

                const dateDiv = document.createElement('div');
                dateDiv.classList.add('formElement');
                const dateLabel = document.createElement('label');
                dateLabel.textContent = `Due Date: `;
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.classList.add('date');
                dateInput.classList.add('field');
                dateInput.name = 'date';
                dateInput.id = 'dateEdit';
                // dateInput.required = true;
                dateLabel.appendChild(dateInput);
                dateDiv.appendChild(dateLabel);

                const priorityDiv = document.createElement('div');
                priorityDiv.classList.add('formElement');
                const priorityLabel = document.createElement('label');
                priorityLabel.textContent = `Priority: `;
                const priorityInput = document.createElement('select');
                priorityInput.classList.add('priority');
                priorityInput.classList.add('field');
                priorityInput.name = 'priorityEdit';
                priorityInput.id = 'priorityEdit';
                const urgentOption = document.createElement('option');
                urgentOption.text = 'Urgent!';
                const highOption = document.createElement('option');
                highOption.text = 'High';
                const mediumOption = document.createElement('option');
                mediumOption.text = 'Medium';
                const lowOption = document.createElement('option');
                lowOption.text = 'Low';
                const backburnerOption = document.createElement('option');
                backburnerOption.text = 'Backburner';
                priorityInput.add(urgentOption);
                priorityInput.add(highOption);
                priorityInput.add(mediumOption);
                priorityInput.add(lowOption);
                priorityInput.add(backburnerOption);
                priorityLabel.appendChild(priorityInput);
                priorityDiv.appendChild(priorityLabel);

                const notesDiv = document.createElement('div');
                notesDiv.classList.add('formElement');
                const notesLabel = document.createElement('label');
                notesLabel.textContent = `Notes: `;
                const notesInput = document.createElement('textarea');
                notesInput.classList.add('notes');
                notesInput.classList.add('field');
                notesInput.name = 'notes';
                notesInput.id = 'notesEdit';
                notesLabel.appendChild(notesInput);
                notesDiv.appendChild(notesLabel);

                const completedDiv = document.createElement('div');
                completedDiv.classList.add('formElement');
                const completedLabel = document.createElement('label');
                completedLabel.textContent = `Completed: `;
                const completedInput = document.createElement('select');
                completedInput.classList.add('completed');
                completedInput.classList.add('field');
                completedInput.name = 'completedEdit';
                completedInput.id = 'completedEdit';
                const yesOption = document.createElement('option');
                yesOption.text = 'Yes';
                const noOption = document.createElement('option');
                noOption.text = 'No';
                completedInput.add(yesOption);
                completedInput.add(noOption);
                completedLabel.appendChild(completedInput);
                completedDiv.appendChild(completedLabel);

                const projectDiv = document.createElement('div');
                projectDiv.classList.add('formElement');
                const projectLabel = document.createElement('label');
                projectLabel.textContent = `Project: `;

                const projectInput = document.createElement('select');
                const projectList = getAllProjects(init.storage);
                for (const item of projectList) {
                    const newDoc = document.createElement('option');
                    newDoc.text = item;
                    projectInput.add(newDoc);
                }
                projectInput.classList.add('project');
                projectInput.classList.add('field');
                projectInput.name = 'project';
                projectInput.id = 'projectEdit';
                projectLabel.appendChild(projectInput);
                projectDiv.appendChild(projectLabel);

                const editButtonsDiv = document.createElement('div');
                editButtonsDiv.classList.add('dialogButtonDiv');

                const editConfirm = document.createElement('button');
                editConfirm.classList.add('dialogButton');
                editConfirm.id = 'confirmBtnEdit';
                editConfirm.value = 'default';
                editConfirm.type = 'submit';
                editConfirm.textContent = 'OK';
                editConfirm.style.color = `black`;

                const editCancel = document.createElement('button');
                editCancel.classList.add('dialogButton');
                editCancel.id = 'cancelBtnEdit';
                editCancel.value = 'cancel';
                editCancel.type = 'button';
                editCancel.textContent = 'Cancel';
                editCancel.formMethod = 'dialog';

                editButtonsDiv.appendChild(editConfirm);
                editButtonsDiv.appendChild(editCancel);

                editForm.appendChild(titleDiv);
                editForm.appendChild(descDiv);
                editForm.appendChild(dateDiv);
                editForm.appendChild(priorityDiv);
                editForm.appendChild(notesDiv);
                editForm.appendChild(completedDiv);
                editForm.appendChild(projectDiv);

                editDialog.appendChild(editTitle);
                editDialog.appendChild(editForm);
                editDialog.appendChild(editButtonsDiv);

                body.appendChild(editDialog);

                const viewCard = document.createElement('dialog');
                viewCard.classList.add('viewDialog');
                const viewOuter = document.createElement('div');
                viewOuter.classList.add('viewOuter');
                const viewTitle = document.createElement('div');
                viewTitle.textContent = `${toDo.title}`;
                viewTitle.style.fontWeight = 'bold';
                viewTitle.classList.add('cardElement');
                const viewDesc = document.createElement('div');
                viewDesc.textContent = `Description:  ${toDo.description}`;
                viewDesc.classList.add('cardElement');
                const viewDate = document.createElement('div');
                viewDate.textContent = `Due Date:  ${toDo.dueDate}`;
                viewDate.classList.add('cardElement');
                const viewPriority = document.createElement('div');
                viewPriority.textContent = `Priority:  ${toDo.priority}`;
                viewPriority.classList.add('cardElement');
                const viewNotes = document.createElement('div');
                viewNotes.textContent = `Notes:  ${toDo.notes}`;
                viewNotes.classList.add('cardElement');
                const viewCompleted = document.createElement('div');
                viewCompleted.textContent = `Completed:  ${toDo.completed}`;
                viewCompleted.classList.add('cardElement');
                const viewProject = document.createElement('div');
                viewProject.textContent = `Project:  ${toDo.project}`;
                viewProject.classList.add('cardElement');

                viewOuter.appendChild(viewTitle);
                viewOuter.appendChild(viewDesc);
                viewOuter.appendChild(viewDate);
                viewOuter.appendChild(viewPriority);
                viewOuter.appendChild(viewNotes);
                viewOuter.appendChild(viewCompleted);
                viewOuter.appendChild(viewProject);

                const viewButtonsDiv = document.createElement('div');
                viewButtonsDiv.classList.add('viewButtonsDiv');

                const viewEdit = document.createElement('img');
                const viewClose = document.createElement('img');
                viewEdit.src = editSvg
                viewClose.src = closeSvg;
                viewEdit.classList.add('cardIcon');
                viewClose.classList.add('cardIcon');

                viewButtonsDiv.appendChild(viewEdit);
                viewButtonsDiv.appendChild(viewClose);
                viewCard.appendChild(viewOuter);
                viewCard.appendChild(viewButtonsDiv);

                viewEdit.addEventListener('click', (event) => {
                    event.preventDefault();

                    titleInput.value = toDo.title;
                    descInput.value = toDo.description;
                    dateInput.value = toDo.dueDate;
                    priorityInput.value = toDo.priority;
                    notesInput.value = toDo.notes;
                    completedInput.value = toDo.completed;
                    projectInput.value = toDo.project;

                    editDialog.style.display = `flex`;
                    editDialog.showModal();
                })

                viewClose.addEventListener('click', (event) => {
                    card.style.opacity = '1';
                    card.style.transition = `all 0.5s linear`;
                    viewCard.style.display = 'none';
                    viewCard.close();
                })

                body.appendChild(viewCard);

                editConfirm.addEventListener('click', (event) => {
                    event.preventDefault();
                    const title = editDialog.querySelector('.title').value;
                    const desc = editDialog.querySelector('.desc').value;
                    const dueDate = editDialog.querySelector('.date').value;
                    const priority = editDialog.querySelector('.priority').value;
                    const notes = editDialog.querySelector('.notes').value;
                    const completed = editDialog.querySelector('.completed').value;
                    const project = editDialog.querySelector('.project').value;

                    card.remove();

                    const newToDo = new CreateToDo(title, desc, dueDate, priority, notes, completed, project);
                    const oldToDo = new CreateToDo(toDo.title, toDo.description, toDo.dueDate, toDo.priority, toDo.notes, toDo.completed, toDo.project);

                    replaceToDo(oldToDo, newToDo, project, init.storage);

                    populateProjects();

                    viewTitle.textContent = `Title: ${title}`;
                    viewDesc.textContent = `Description: ${desc}`;
                    viewDate.textContent = `Due Date: ${dueDate} `;
                    viewPriority.textContent = `Priority: ${priority} `;
                    viewNotes.textContent = `Notes: ${notes} `;
                    viewCompleted.textContent = `Completed: ${completed} `;
                    viewProject.textContent = `Project: ${project} `;

                    editForm.reset();
                    editDialog.style.display = `none`;
                    editDialog.close();
                })

                editCancel.addEventListener('click', () => {
                    card.style.opacity = '1';
                    card.style.transition = `all 0.5s linear`;
                    editForm.reset();
                    editDialog.style.display = `none`;
                    editDialog.close();
                })

                view.addEventListener('click', (event) => {
                    event.currentTarget.parentElement.parentElement.style.opacity = '0.5';
                    event.currentTarget.parentElement.parentElement.style.transition = `all 0.5s linear`;
                    viewCard.style.display = `flex`;
                    viewCard.showModal();
                })

                edit.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.currentTarget.parentElement.parentElement.style.opacity = '0.5';
                    event.currentTarget.parentElement.parentElement.style.transition = `all 0.5s linear`;
                    titleInput.value = toDo.title;
                    descInput.value = toDo.description;
                    dateInput.value = toDo.dueDate;
                    priorityInput.value = toDo.priority;
                    notesInput.value = toDo.notes;
                    completedInput.value = toDo.completed;
                    projectInput.value = toDo.project;

                    editDialog.style.display = `flex`;
                    editDialog.showModal();
                })

                del.addEventListener('click', (event) => {
                    event.currentTarget.parentElement.parentElement.style.opacity = '0.5';
                    event.currentTarget.parentElement.parentElement.style.transition = `all 0.5s linear`;
                    deleteDialog.style.display = `flex`;
                    deleteDialog.showModal();
                })
            }
        }
    }
    return currList;
}

function populateProjects() {

    const data = JSON.parse(init.storage.getItem('data'));

    const selectedProjects = getSelectedProjects();

    const projectList = getAllProjects(init.storage);

    const projectDivs = document.querySelectorAll('.projectDiv')
    if (projectDivs) {
        for (const item of projectDivs) {
            item.remove();
        }
    }

    let currentProjectList = [];

    for (const project of projectList) {

        const body = document.querySelector('body');
        const projects = document.querySelector('.projects');
        const projectItem = document.createElement('div');
        projectItem.classList.add('projectDiv');
        const projectText = document.createElement('span');
        if (project !== null && project !== '') { projectText.textContent = project; }
        else {
            projectText.textContent = 'default';
            projectText.style.fontStyle = 'italic';
        }
        projectText.classList.add('projectText');
        const edit = document.createElement('img');
        const del = document.createElement('img');
        edit.src = editSvg;
        del.src = delSvg;
        edit.classList.add('projectEditIcon');
        del.classList.add('projectDelIcon');
        edit.classList.add('cardIcon');
        del.classList.add('cardIcon');
        const projectIconContainer = document.createElement('div');
        projectIconContainer.classList.add('projectIconContainer');
        projectIconContainer.appendChild(edit);
        projectIconContainer.appendChild(del);
        projectItem.appendChild(projectText);
        if (project !== null && project !== '') { projectItem.appendChild(projectIconContainer); }
        projects.appendChild(projectItem);

        const editProjectDialog = document.createElement('dialog');
        editProjectDialog.classList.add('editProjectDialog');
        const editProjectTitle = document.createElement('span');
        editProjectTitle.textContent = `Edit Project`;
        editProjectTitle.classList.add('editProjectTitleText');

        const editProjectForm = document.createElement('form');

        const editProjectTitleDiv = document.createElement('div');
        editProjectTitleDiv.classList.add('formElement');
        const editProjectTitleLabel = document.createElement('label');
        editProjectTitleLabel.textContent = `Project Name: `;
        const editProjectTitleInput = document.createElement('input');
        editProjectTitleInput.type = 'text';
        editProjectTitleInput.classList.add('editProjectTitle');
        editProjectTitleInput.classList.add('field');
        editProjectTitleInput.name = 'title';
        editProjectTitleInput.id = 'editProjectTitle';
        editProjectTitleInput.autofocus = true;
        editProjectTitleLabel.appendChild(editProjectTitleInput);
        editProjectTitleDiv.appendChild(editProjectTitleLabel);

        const editProjectButtonsDiv = document.createElement('div');
        editProjectButtonsDiv.classList.add('editProjectButtonsDiv');

        const editProjectConfirm = document.createElement('button');
        editProjectConfirm.classList.add('dialogButton');
        editProjectConfirm.id = 'confirmBtnEditProject';
        editProjectConfirm.value = 'default';
        editProjectConfirm.type = 'submit';
        editProjectConfirm.textContent = 'OK';
        editProjectConfirm.style.color = 'black';

        const editProjectCancel = document.createElement('button');
        editProjectCancel.classList.add('dialogButton');
        editProjectCancel.id = 'cancelBtnEditProject';
        editProjectCancel.value = 'cancel';
        editProjectCancel.type = 'button';
        editProjectCancel.textContent = 'Cancel';
        editProjectCancel.formMethod = 'dialog';

        editProjectButtonsDiv.appendChild(editProjectConfirm);
        editProjectButtonsDiv.appendChild(editProjectCancel);

        editProjectForm.appendChild(editProjectTitleDiv);

        editProjectDialog.appendChild(editProjectTitle);
        editProjectDialog.appendChild(editProjectForm);
        editProjectDialog.appendChild(editProjectButtonsDiv)

        body.appendChild(editProjectDialog);

        edit.addEventListener('click', (event) => {
            event.preventDefault();

            editProjectTitleInput.value = project;

            editProjectDialog.style.display = `flex`;
            editProjectDialog.showModal();
        })

        editProjectConfirm.addEventListener('click', (event) => {
            event.preventDefault();

            let select = false;

            if (selectedProjects.includes(project)) {
                select = true;
            }

            const newProjectName = editProjectDialog.querySelector('.editProjectTitle').value;

            const index = data.indexOf(data.find(item => item.name === project))
            for (let toDo of data[index].toDos) {
                toDo.project = newProjectName;
            }
            data[index].name = newProjectName;

            init.storage.setItem('data', JSON.stringify(data));

            populateProjects();

            if (select) {
                setSelected(newProjectName);
            }

            populateProjects();

            editProjectForm.reset();
            editProjectDialog.style.display = `none`;
            editProjectDialog.close();

        })

        editProjectCancel.addEventListener('click', () => {
            editProjectForm.reset();
            editProjectDialog.style.display = `none`;
            editProjectDialog.close();
        })

        const size = getToDosSize(project, init.storage);

        const deleteProjectDialog = document.createElement('dialog');
        deleteProjectDialog.classList.add('deleteProject');
        const deleteProjectDialogText = document.createElement('p');

        if (size > 0) {
            deleteProjectDialogText.textContent = `Do you want to delete all the To Dos within this project ? `;
        }
        else {
            deleteProjectDialogText.textContent = `Are you sure you want to delete this project ? `;
        }
        const deleteProjectDialogButtonDiv = document.createElement('div');
        deleteProjectDialogButtonDiv.classList.add('dialogButtonDiv');
        const confirmDelProjectKeep = document.createElement('button');
        confirmDelProjectKeep.classList.add('dialogButton');
        confirmDelProjectKeep.textContent = `Keep To Dos`;
        const confirmDelProjectToDos = document.createElement('button');
        confirmDelProjectToDos.classList.add('dialogButton');
        confirmDelProjectToDos.textContent = `Delete To Dos`;
        const confirmDelProject = document.createElement('button');
        confirmDelProject.classList.add('dialogButton');
        confirmDelProject.textContent = `OK`;
        confirmDelProject.style.color = `black`;
        const cancelDelProject = document.createElement('button');
        cancelDelProject.classList.add('dialogButton');
        cancelDelProject.type = `button`;
        cancelDelProject.textContent = `Cancel`;

        del.addEventListener('click', () => {
            deleteProjectDialog.style.display = `flex`;
            deleteProjectDialog.showModal();
        })

        cancelDelProject.addEventListener('click', () => {
            deleteProjectDialog.style.display = `none`;
            deleteProjectDialog.close();
        })

        confirmDelProjectKeep.addEventListener('click', () => {

            const data = JSON.parse(init.storage.getItem('data'));

            const index = data.indexOf(data.find(item => item.name === project));
            const defaultIndex = data.indexOf(data.find(item => item.name === ''));

            for (let toDo of data[index].toDos) {
                toDo.project = '';
                data[defaultIndex].toDos.push(toDo);
            }

            data.splice(index, 1);

            init.storage.setItem('data', JSON.stringify(data));

            populateProjects();

            const selectedProjects = getSelectedProjects();
            populateCards(selectedProjects);

            deleteProjectDialog.style.display = `none`;
            deleteProjectDialog.close();
        })

        confirmDelProjectToDos.addEventListener('click', () => {
            const data = JSON.parse(init.storage.getItem('data'));
            const index = data.indexOf(data.find(item => item.name === project))
            data.splice(index, 1);

            init.storage.setItem('data', JSON.stringify(data));

            populateProjects();

            const selectedProjects = getSelectedProjects();
            populateCards(selectedProjects);

            deleteProjectDialog.style.display = `none`;
            deleteProjectDialog.close();
        })

        confirmDelProject.addEventListener('click', () => {
            const data = JSON.parse(init.storage.getItem('data'));
            const index = data.indexOf(data.find(item => item.name === project))
            data.splice(index, 1);

            init.storage.setItem('data', JSON.stringify(data));

            populateProjects();

            deleteProjectDialog.style.display = `none`;
            deleteProjectDialog.close();
        })

        if (size > 0) {
            deleteProjectDialogButtonDiv.appendChild(confirmDelProjectKeep);
            deleteProjectDialogButtonDiv.appendChild(confirmDelProjectToDos);
            deleteProjectDialogButtonDiv.appendChild(cancelDelProject);
        }
        else {
            deleteProjectDialogButtonDiv.appendChild(confirmDelProject);
            deleteProjectDialogButtonDiv.appendChild(cancelDelProject);
        }

        deleteProjectDialog.appendChild(deleteProjectDialogText);
        deleteProjectDialog.appendChild(deleteProjectDialogButtonDiv);

        body.appendChild(deleteProjectDialog);

        let selected;

        if (selectedProjects.includes(project)) {
            selected = true;
            setSelected(project);
            currentProjectList.push(project);
            populateCards(currentProjectList);
        }
        else {
            selected = false;
        }

        projectText.addEventListener('click', (event) => {

            if (selected === false) {
                event.currentTarget.parentElement.style.boxShadow = '5px 5px 5px 5px rgba(0, 0, 0, .25)';
                event.currentTarget.parentElement.style.opacity = `.5`;
                event.currentTarget.parentElement.style.transition = '.5s';
                selected = true;
                if (event.currentTarget.textContent !== 'default') { currentProjectList.push(event.currentTarget.textContent); }
                else if (event.currentTarget.textContent === 'default') {
                    currentProjectList.push('');
                }
                populateCards(currentProjectList);

            } else if (selected === true) {

                event.currentTarget.parentElement.style.boxShadow = 'none';
                event.currentTarget.parentElement.style.opacity = `1`;
                event.currentTarget.parentElement.style.transition = '.5s';
                selected = false;
                currentProjectList = currentProjectList.filter((item) => {
                    if (event.currentTarget.textContent !== 'default') {
                        return item !== event.currentTarget.textContent;
                    } else if (event.currentTarget.textContent === 'default') {
                        return item !== '';
                    }
                })
                populateCards(currentProjectList);
            }
        })
    }
    return currentProjectList;
}

function addProject(projectName, storage) {
    const data = JSON.parse(storage.getItem('data'));

    if (data.find(item => item.name === projectName)) {
        return false;
    } else {
        data.push(new CreateProject(projectName));
        storage.setItem('data', JSON.stringify(data));
        return true;
    }
}

function getCurrToDos(pList, storage) {
    let currToDoList = [];

    const data = JSON.parse(storage.getItem('data'));

    for (const project of pList) {
        if (data.find(item => item.name === project)) {
            const index = data.indexOf(data.find(item => item.name === project));
            currToDoList.push(data[index]);
        }
    }

    currToDoList = [...new Set(currToDoList)];

    return currToDoList;
}

function replaceToDo(oldToDo, newToDo, project, storage) {

    const data = JSON.parse(storage.getItem('data'));

    if (project !== oldToDo.project) {
        if (data.find(item => item.name === oldToDo.project)) {
            const index = data.indexOf(data.find(item => item.name === oldToDo.project));
            for (let i = 0; i < data[index].toDos.length; i++) {
                if (oldToDo.title === data[index].toDos[i].title && oldToDo.description === data[index].toDos[i].description && oldToDo.dueDate === data[index].toDos[i].dueDate && oldToDo.priority === data[index].toDos[i].priority && oldToDo.notes === data[index].toDos[i].notes && oldToDo.completed === data[index].toDos[i].completed) {
                    data[index].toDos.splice(i, 1);
                }
            }
        }
        if (data.find(item => item.name === project)) {
            const index = data.indexOf(data.find(item => item.name === project));
            data[index].toDos.push(newToDo);
        }
    }
    else {
        if (data.find(item => item.name === oldToDo.project)) {
            const index = data.indexOf(data.find(item => item.name === oldToDo.project));
            for (let toDo of data[index].toDos) {
                if (oldToDo.title === toDo.title && oldToDo.description === toDo.description && oldToDo.dueDate === toDo.dueDate && oldToDo.priority === toDo.priority && oldToDo.notes === toDo.notes && oldToDo.completed === toDo.completed) {
                    toDo.title = newToDo.title;
                    toDo.description = newToDo.description;
                    toDo.dueDate = newToDo.dueDate;
                    toDo.priority = newToDo.priority;
                    toDo.notes = newToDo.notes;
                    toDo.completed = newToDo.completed;
                }
            }
        }
    }
    storage.setItem('data', JSON.stringify(data));
    return data;
}

function deleteToDo(toDo, storage) {

    const data = JSON.parse(storage.getItem('data'));

    for (const project of data) {
        for (let j = 0; j < project.toDos.length; j++) {
            if (toDo.title === project.toDos[j].title && toDo.description === project.toDos[j].description && toDo.dueDate === project.toDos[j].dueDate && toDo.priority === project.toDos[j].priority && toDo.notes === project.toDos[j].notes && toDo.completed === project.toDos[j].completed && toDo.project === project.toDos[j].project) {
                project.toDos.splice(j, 1);
            }
        }
    }
    storage.setItem('data', JSON.stringify(data));
    return data;
}

function addToDo(toDo, storage) {
    let data = [];

    if (addProject(toDo.project, storage)) {
        data = JSON.parse(storage.getItem('data'));
        const index = data.indexOf(data.find(item => item.name === toDo.project));
        data[index].toDos.push(toDo);
    }
    else {
        data = JSON.parse(storage.getItem('data'));
        const index = data.indexOf(data.find(item => item.name === toDo.project));
        data[index].toDos.push(toDo);
    }
    storage.setItem('data', JSON.stringify(data));
    return data;
}

function getToDosSize(project, storage) {
    const data = JSON.parse(storage.getItem('data'));
    if (data.find(item => item.name === project)) {
        const index = data.indexOf(data.find(item => item.name === project))
        {
            return data[index].toDos.length;
        }
    } else {
        return 0;
    }
}

function getAllProjects(storage) {

    let allProjects = [];

    const data = JSON.parse(storage.getItem('data'));

    for (const item of data) {
        allProjects.push(item.name);
    }

    allProjects = [...new Set(allProjects)];

    return allProjects;
}

function getSelectedProjects() {
    const selectedProjects = [];
    const projectDivs = document.querySelectorAll('.projectDiv');
    if (projectDivs) {
        for (const projectItem of projectDivs) {
            if (window.getComputedStyle(projectItem).opacity === '0.5') {
                if (projectItem.textContent === 'default') {
                    selectedProjects.push('');
                }
                else if (projectItem.textContent !== 'default') {
                    selectedProjects.push(projectItem.textContent);
                }
            }
        }
    }
    return selectedProjects;
}

function setSelected(project) {
    const projectDivs = document.querySelectorAll('.projectDiv');
    if (projectDivs) {
        for (const projectItem of projectDivs) {
            if (projectItem.textContent === project) {
                projectItem.style.boxShadow = '5px 5px 5px 5px rgba(0, 0, 0, .25)';
                projectItem.style.opacity = '.5';
                projectItem.style.transition = '.5s';
                return projectItem;
            }
            if (project === '') {
                if (projectItem.textContent === 'default') {
                    projectItem.style.boxShadow = '5px 5px 5px 5px rgba(0, 0, 0, .25)';
                    projectItem.style.opacity = '.5';
                    projectItem.style.transition = '.5s';
                    return projectItem;
                }
            }
        }
    }
}

export { renderWorkspace, populateProjects };
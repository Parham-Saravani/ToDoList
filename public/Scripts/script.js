const openModalBtn = document.querySelector('.openModal')
const addToDoBtn = document.querySelector('.submit__btn')
const closeModalBtn = document.querySelector('.close__btn');
const modal = document.querySelector('.modal');
const progress = document.querySelector('.progress  ')
const titleInput = document.querySelector('.title__input')
const descriptionInpu = document.querySelector('.description__input')
const doneToDoes = document.querySelector('.doneToDo');
const allToDoes = document.querySelector('.allToDo');
const todoContainer = document.querySelector('.todo__container')
const titleAlert = document.querySelector('.title__alert')
// Toast 
const toast = document.querySelector('.toast')
const toastImage = document.querySelector('.toast__image')
const toastText = document.querySelector('.toast__text')
const toastProgress = document.querySelector('.toast__progress')
const toastProgressWrapper = document.querySelector('.toast__progress--wrapper')
let toastProgressNumber = 100;

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let Todo = [];

//HELPER FUNCTIONS
function inputTitleAlertHandler(remove, add) {
    titleAlert.classList.remove(remove)
    titleAlert.classList.add(add)
}

// Toast functions
function showToast(template) {
    toast.classList.add('flex');
    toast.classList.remove('hidden');

    switch (template) {
        case "add": {

            toastProgress.classList.add('bg-green-600')
            toastProgressWrapper.classList.add('bg-green-600/9')
            toastText.textContent = 'Todo successfully added!'
            toastImage.setAttribute('src', './assets/Images/success.png');
            toastProgressHandler();

            break;
        };
        case "delete": {

            toastProgress.classList.add('bg-red-600')
            toastProgressWrapper.classList.add('bg-red-600/9')
            toastText.textContent = 'Todo successfully deleted!'
            toastImage.setAttribute('src', './assets/Images/failed.png');
            toastProgressHandler();
            break;
        }
    }
}
function hideToast() {
    toast.classList.remove('flex');
    toast.classList.add('hidden');
}
function toastProgressHandler() {
    toastProgress.classList.remove('w-full')

    const handler = setInterval(function () {
        toastProgressNumber--;
        toastProgress.style.width = `${toastProgressNumber}%`;
        if (toastProgressNumber === -3) {
            hideToast();
            clearInterval(handler);
            toastProgressNumber = 100;
            toastProgress.style.width = `${toastProgressNumber}%`;
        }
    }, 20)
}

// Modal functions
function hideModal() {
    modal.classList.add('hidden');
}
function showModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
// function for todo add date
function timeHandler() {
    const date = new Date();
    const hour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const fullYear = `${months[date.getMonth()]}  ${date.getDay()}  ${date.getFullYear()}`;
    return `${fullYear} - ${hour}`;
}
function addToDoHandler() {
    const date = timeHandler();
    const title = titleInput.value.trim();
    const description = descriptionInpu.value.trim();

    if (!title) {
        inputTitleAlertHandler('hidden', 'block')
        return;
    }
    const newToDo = {
        id: Math.floor(Math.random() * 1000000),
        title: title,
        description: description,
        isDone: false,
        date: date,
    }
    Todo.push(newToDo);
    createToDoes();
    saveDataInLocalStorage()
    hideModal();
    titleInput.value = '';
    descriptionInpu.value = '';
    doneToDoHandler(Todo.length);
    showToast('add');
    inputTitleAlertHandler('block', 'hidden')

}
function createToDoes() {
    todoContainer.innerHTML = '';
    Todo.forEach(item => {
        todoContainer.insertAdjacentHTML('beforeend',
            `
        <article class="flex items-center justify-between w-full h-20 bg-blue-600/9 rounded-xl px-5 py-4 leading-4">
            <div class="flex items-center gap-4">
                <div class="flex justify-center items-center w-10 h-10 rounded-xl bg-blue-600/9 text-transparent ${item.isDone ? 'text-white bg-green-600' : ''}">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="6" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"></path>
                                        </svg>
                                    </span>
                </div>
                <div class="flex flex-col gap-1 text-white">
                                    <p class="font-black text-xl">${item.title}</p>
                                    <p class="font-light text-xs"> ${item.date}</p>
                </div>
            </div>
            <div class="flex gap-1.5">
                <button class="flex justify-center items-center w-10 h-10 rounded-full bg-yellow-500/9 cursor-pointer text-yellow-600 hover:bg-yellow-600/9 transition-all duration-300 edit" data-index="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="flex justify-center items-center w-10 h-10 rounded-full bg-red-500/9 cursor-pointer text-red-600 hover:bg-red-600/9 transition-all duration-300 delete" data-index="${item.id}"><i class="fa-solid fa-trash"></i></button>
                <button class="flex justify-center items-center w-10 h-10 rounded-full bg-green-500/9 cursor-pointer text-green-600 hover:bg-green-600/9 transition-all duration-300 done" data-index="${item.id}"><i class="fas fa-check-circle"></i></button>
            </div>
        </article>
        `
        );
    });
    allToDoes.textContent = Todo.length
}
function onPageLoad() {
    const data = JSON.parse(localStorage.getItem('todo'));
    if (!data) {
        doneToDoHandler()
        return;
    };
    Todo = data;
    createToDoes();
    doneToDoHandler(Todo.length);
}
// LocalStorage function 
function saveDataInLocalStorage() {
    localStorage.setItem('todo', JSON.stringify(Todo));
}

// function for handling header progress
function doneToDoHandler(todoLength = 0) {
    const doneNumber = Todo.filter(function (item) {
        return item.isDone === true
    })

    if (!doneNumber.length) {
        progress.style.width = `0%`;
        doneToDoes.textContent = doneNumber.length;
        return;
    }

    const value = (doneNumber.length / todoLength) * 100
    progress.style.width = `${value}%`
    doneToDoes.textContent = doneNumber.length
}

function deleteOrEditToDO(event) {
    const editBtn = event.target.classList.contains('edit');
    const editIcon = event.target.classList.contains('fa-pen-to-square');
    const deleteBtn = event.target.classList.contains('delete');
    const deleteIcon = event.target.classList.contains('fa-trash');
    const doneBtn = event.target.classList.contains('done');
    const doneIcon = event.target.classList.contains('fa-check-circle');

    if (doneBtn || doneIcon) {
        if (doneIcon) {
            const elementTitle = event.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild;
            const itemIndex = Todo.findIndex(function (item) {
                return item.title === elementTitle.textContent;
            });
            const wantedItem = Todo[itemIndex];
            wantedItem.isDone = true;
            saveDataInLocalStorage()
            doneToDoHandler(Todo.length);
            const chechbox = event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild
            chechbox.classList.remove('text-transparent');
            chechbox.classList += ' text-white bg-green-600';

            return;
        }
        const elementTitle = event.target.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild;
        const itemIndex = Todo.findIndex(function (item) {
            return item.title === elementTitle.textContent;
        });
        const wantedItem = Todo[itemIndex];

        wantedItem.isDone = true;
        saveDataInLocalStorage()
        doneToDoHandler(Todo.length);
        const chechbox = event.target.parentElement.parentElement.firstElementChild.firstElementChild
        chechbox.classList.remove('text-transparent');
        chechbox.classList += ' text-white bg-green-600';
    }
    if (editBtn || editIcon) {
    }
    if (deleteBtn || deleteIcon) {
        if (deleteIcon) {
            const elementTitle = event.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild;
            const index = Todo.findIndex(function (item) {
                return item.title === elementTitle.textContent
            })
            Todo.splice(index, 1);
            saveDataInLocalStorage();
            event.target.parentElement.parentElement.parentElement.remove()
            doneToDoHandler(Todo.length);
            allToDoes.textContent = Todo.length;
            showToast('delete')
            return;
        }
        const elementTitle = event.target.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild;
        const index = Todo.findIndex(function (item) {
            return item.title === elementTitle.textContent
        })
        Todo.splice(index, 1);
        saveDataInLocalStorage();
        event.target.parentElement.parentElement.remove();
        doneToDoHandler(Todo.length);
        allToDoes.textContent = Todo.length;
        showToast('delete')

    }
}
openModalBtn.addEventListener('click', showModal)
addToDoBtn.addEventListener('click', addToDoHandler);
closeModalBtn.addEventListener('click', hideModal);
document.addEventListener('DOMContentLoaded', onPageLoad)
todoContainer.addEventListener('click', deleteOrEditToDO)
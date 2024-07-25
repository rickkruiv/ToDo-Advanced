const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const newTodo = document.querySelector('#create-task');
const todoContainer = document.querySelector('#todo-container');

const buttons = document.querySelectorAll('button');

const editForm = document.querySelector('#edit-form');
const cancelEditBtn = document.querySelector('#cancel-edit')
const editInput = document.querySelector('#edit-input');

const searchTodo = document.querySelector('.search-task');
const searchInput = document.querySelector('#search-input');
const searchClearBtn = document.querySelector('#clear-search-btn');
let oldTodoTitle;

const filterBtn = document.querySelector('#filter-select');

// funções
function saveTodo(text, done = false, save = true) {
    const todo = document.createElement('div');
    todo.classList.add('todo');
    if (done) {
        todo.classList.add('done');
    }

    const todoTitle = document.createElement('p');
    todoTitle.classList.add('todo-name');
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');
    
    const completedBtn = document.createElement('button');
    completedBtn.classList.add('completed');
    completedBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    actionsDiv.appendChild(completedBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    actionsDiv.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    actionsDiv.appendChild(deleteBtn);

    todo.appendChild(actionsDiv);
    todoContainer.appendChild(todo);

    if (save) {
        saveTodoLocalStorage({text, done});
    }

    todoInput.value = '';
    todoInput.focus();
}


function toggleForms() {
    todoForm.classList.toggle('hide');
    editForm.classList.toggle('hide');
    todoContainer.classList.toggle('hide');
    searchTodo.classList.toggle('hide');

};

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo');
    
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('p');
        
        if (todoTitle.innerText === oldTodoTitle) {
            todoTitle.innerText = text;
            
            updateTodoTextLocalStorage(oldTodoTitle, text)
        }
    })
};

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('p').innerText.toLowerCase();

        todo.style.display = todoTitle.includes(search) ? 'flex' : 'none';
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll('.todo');

    switch(filterValue) {
        case "all": todos.forEach((todo) => todo.style.display = 'flex')
        break;

        case "done": 
            todos.forEach((todo) => todo.classList.contains('done') 
                ? todo.style.display = 'flex' 
                : todo.style.display = 'none')
            break;

        case "todo": todos.forEach((todo) => 
            !todo.classList.contains('done') 
                ? todo.style.display = 'flex' 
                : todo.style.display = 'none')
            break;

        default: 
            break;
    }
};

// eventos
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = todoInput.value;

    if (text) {
        saveTodo(text);
    };
});

document.addEventListener('click', (e) => {
    const targetEl = e.target;
    const todoEl = targetEl.closest('.todo');
    if (!todoEl) return;
    let todoTitle;

    if (todoEl && todoEl.querySelector('p')) {
        todoTitle = todoEl.querySelector('p').innerText || "";
    }
    
    if (targetEl.classList.contains('completed') || targetEl.classList.contains('cancel')) {
        todoEl.classList.toggle('done');

        targetEl.innerHTML = todoEl.classList.contains('done') ? '<i class="fa-solid fa-x"></i>' : '<i class="fa-solid fa-check"></i>';

        targetEl.classList.toggle('completed');
        targetEl.classList.toggle('cancel');
        updateTodoStatusLocalStorage(todoTitle);
    };

    if (targetEl.classList.contains('delete')) {
        todoEl.remove()
        removeTodoLocalStorage(todoTitle);
    };
    
    if (targetEl.classList.contains('edit')) {
        toggleForms();
        editInput.focus()
        editInput.value = todoTitle;
        oldTodoTitle = todoTitle;
    };
});

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms();
});

searchInput.addEventListener('keyup', (e) => {
    const searchValue = e.target.value.toLowerCase();
    getSearchTodos(searchValue);
});

searchClearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';

    searchInput.dispatchEvent(new Event('keyup'));
});

filterBtn.addEventListener('change', (e) => {
    
    const filterValue = e.target.value;
    filterTodos(filterValue)
})

// Local Storage 

// pegar todos
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    return todos;
};

const loadTodo = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })

}

const saveTodoLocalStorage = (todo) => {
    // todos os TODOS da ls
    const todos = getTodosLocalStorage();

    // add o novo todo no array
    todos.push(todo);

    // salvar tudo na ls
    localStorage.setItem('todos', JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    
    const filteredTodos = todos.filter((todo) => todo.text !== todoText)
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
}

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null)
    localStorage.setItem('todos', JSON.stringify(todos));
}

const updateTodoTextLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null)
    localStorage.setItem('todos', JSON.stringify(todos));
}

loadTodo()

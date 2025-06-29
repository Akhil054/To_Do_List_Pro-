// HELLO 
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCounter = document.getElementById('task-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCounter();
        
        // Event Listeners
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            taskInput.value = '';
            renderTasks();
            updateTaskCounter();
        }
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = [];
        
        switch(currentFilter) {
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = [...tasks];
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet!' : 
                                      currentFilter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = 'var(--dark-gray)';
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                toggleTaskComplete(task.id);
                // After toggling, re-render to ensure proper filtering
                renderTasks();
                updateTaskCounter();
            });
            
            const taskText = document.createElement('span');
            taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
            taskText.textContent = task.text;
            
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', () => editTask(task.id, taskText));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', () => {
                deleteTask(task.id);
                renderTasks();
                updateTaskCounter();
            });
            
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(taskActions);
            
            taskList.appendChild(taskItem);
        });
    }
    
    // Toggle task completion status
    function toggleTaskComplete(id) {
        tasks = tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        );
        saveTasks();
        updateTaskCounter();
    }
    
    // Edit task text
    function editTask(id, taskTextElement) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;
        
        const currentText = task.text;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = currentText;
        
        taskTextElement.textContent = '';
        taskTextElement.appendChild(input);
        input.focus();
        
        function saveEdit() {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                task.text = newText;
                saveTasks();
            }
            renderTasks();
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEdit();
        });
    }
    
    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
    }
    
    // Clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCounter();
    }
    
    // Update task counter
    function updateTaskCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        const text = activeTasks === 1 ? '1 item left' : `${activeTasks} items left`;
        taskCounter.textContent = text;
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Initialize the app
    init();
});
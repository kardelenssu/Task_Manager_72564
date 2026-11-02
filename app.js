let CONFIG = {};

async function init() {
    try {
        const configRes = await fetch('config.json');
        CONFIG = await configRes.json();
        await fetchTasks();
    } catch (err) {
        showStatus('Failed to load configuration or initial data.', true);
    }
}

function showStatus(msg, isError = false) {
    const el = document.getElementById('status-message');
    el.innerText = msg;
    el.style.color = isError ? 'red' : 'green';
    setTimeout(() => { el.innerText = ''; }, 4000);
}

function getHeaders() {
    return {
        'apikey': CONFIG.supabasePublishableKey,
        'Authorization': `Bearer ${CONFIG.supabasePublishableKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };
}

async function fetchTasks() {
    try {
        const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${CONFIG.tableName}?select=*`, {
            headers: getHeaders()
        });
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        showStatus('Error fetching tasks.', true);
    }
}

function renderTasks(tasks) {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.setAttribute('data-id', task.id);

        item.innerHTML = `
            <h3 class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</h3>
            <p class="task-description">${escapeHtml(task.description || '')}</p>
            <p class="task-status">Status: ${task.completed ? 'Completed' : 'Incomplete'}</p>
            <button class="toggle-task" onclick="toggleTask(${task.id}, ${task.completed})">
                ${task.completed ? 'Mark Incomplete' : 'Mark Completed'}
            </button>
            <button class="edit-task" onclick="startEdit(${task.id}, '${escapeQuotes(task.title)}', '${escapeQuotes(task.description || '')}')">Edit</button>
            <button class="delete-task" onclick="deleteTask(${task.id})">Delete</button>
        `;
        list.appendChild(item);
    });
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('task-edit-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    if (editId) {
        try {
            const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${CONFIG.tableName}?id=eq.${editId}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ title, description })
            });
            if (res.ok) {
                showStatus('Task updated successfully!');
                resetForm();
                fetchTasks();
            } else { showStatus('Failed to update task.', true); }
        } catch (err) { showStatus('Error updating task.', true); }
    } else {
        try {
            const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${CONFIG.tableName}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ title, description, completed: false })
            });
            if (res.ok) {
                showStatus('Task created successfully!');
                resetForm();
                fetchTasks();
            } else { showStatus('Failed to create task.', true); }
        } catch (err) { showStatus('Error creating task.', true); }
    }
});

async function toggleTask(id, currentStatus) {
    try {
        const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${CONFIG.tableName}?id=eq.${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ completed: !currentStatus })
        });
        if (res.ok) { fetchTasks(); }
        else { showStatus('Failed to toggle status.', true); }
    } catch (err) { showStatus('Error toggling status.', true); }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${CONFIG.tableName}?id=eq.${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) {
            showStatus('Task deleted.');
            fetchTasks();
        } else { showStatus('Failed to delete task.', true); }
    } catch (err) { showStatus('Error deleting task.', true); }
}

function startEdit(id, title, description) {
    document.getElementById('task-edit-id').value = id;
    document.getElementById('task-title').value = title;
    document.getElementById('task-description').value = description;
    document.getElementById('task-submit').innerText = 'Save Changes';
}

function resetForm() {
    document.getElementById('task-edit-id').value = '';
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-submit').innerText = 'Add Task';
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeQuotes(str) {
    return str.replace(/'/g, "\'").replace(/"/g, '&quot;');
}

init();
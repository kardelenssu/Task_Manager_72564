const CONFIG_FILE = 'config.json';

let config = null;
let editingTaskId = null;

const elements = {};
const state = {
  tasks: []
};

function cacheElements() {
  elements.taskForm = document.getElementById('task-form');
  elements.taskTitle = document.getElementById('task-title');
  elements.taskDescription = document.getElementById('task-description');
  elements.taskSubmit = document.getElementById('task-submit');
  elements.taskCancel = document.getElementById('task-cancel');
  elements.taskId = document.getElementById('task-id');
  elements.taskList = document.getElementById('task-list');
  elements.statusMessage = document.getElementById('status-message');
  elements.formTitle = document.getElementById('form-title');
  elements.refreshTasks = document.getElementById('refresh-tasks');
}

function setStatus(message, type = '') {
  elements.statusMessage.textContent = message || '';
  elements.statusMessage.className = `status${type ? ` ${type}` : ''}`;
}

function clearForm() {
  editingTaskId = null;
  elements.taskForm.reset();
  elements.taskId.value = '';
  elements.taskSubmit.textContent = 'Add Task';
  elements.formTitle.textContent = 'Add Task';
  elements.taskCancel.classList.add('hidden');
}

function fillForm(task) {
  editingTaskId = String(task.id);
  elements.taskId.value = String(task.id);
  elements.taskTitle.value = task.title ?? '';
  elements.taskDescription.value = task.description ?? '';
  elements.taskSubmit.textContent = 'Save Task';
  elements.formTitle.textContent = 'Edit Task';
  elements.taskCancel.classList.remove('hidden');
  elements.taskTitle.focus();
}

function normalizeText(value) {
  return (value ?? '').toString().trim();
}

function sanitizeTask(raw) {
  return {
    id: raw.id,
    title: normalizeText(raw.title),
    description: normalizeText(raw.description),
    completed: Boolean(raw.completed)
  };
}

async function loadConfig() {
  const response = await fetch(CONFIG_FILE, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Could not load ${CONFIG_FILE}`);
  }
  const data = await response.json();
  if (!data.supabaseUrl || !data.supabasePublishableKey || data.tableName !== 'tasks') {
    throw new Error('config.json is missing required fields');
  }
  return data;
}

function apiBaseUrl() {
  return `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/${config.tableName}`;
}

function apiHeaders(extra = {}) {
  return {
    apikey: config.supabasePublishableKey,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...options,
    headers: apiHeaders(options.headers || {})
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  if (!response.ok) {
    const detail = Array.isArray(payload)
      ? JSON.stringify(payload)
      : (payload?.message || payload?.error || response.statusText);
    throw new Error(detail || 'Request failed');
  }

  return payload;
}

async function fetchTasks() {
  const data = await request('?select=*&order=id.asc', {
    method: 'GET',
    headers: {
      Prefer: 'return=representation'
    }
  });
  return Array.isArray(data) ? data.map(sanitizeTask) : [];
}

async function createTask(task) {
  const data = await request('', {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      Prefer: 'return=representation'
    }
  });
  return Array.isArray(data) ? sanitizeTask(data[0]) : sanitizeTask(data);
}

async function updateTask(id, task) {
  const data = await request(`?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
    headers: {
      Prefer: 'return=representation'
    }
  });
  return Array.isArray(data) ? sanitizeTask(data[0]) : sanitizeTask(data);
}

async function deleteTask(id) {
  await request(`?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=minimal'
    }
  });
}

async function toggleTask(task) {
  const updated = {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: !task.completed
  };
  return updateTask(task.id, updated);
}

function createButton(className, text, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  button.addEventListener('click', handler);
  return button;
}

function renderTasks() {
  elements.taskList.innerHTML = '';

  if (!state.tasks.length) {
    const empty = document.createElement('p');
    empty.className = 'status';
    empty.textContent = 'No tasks yet. Add your first task above.';
    elements.taskList.appendChild(empty);
    return;
  }

  for (const task of state.tasks) {
    const item = document.createElement('article');
    item.className = `task-item${task.completed ? ' completed' : ''}`;
    item.dataset.id = task.id;

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const description = document.createElement('div');
    description.className = 'task-description';
    description.textContent = task.description || 'No description provided.';

    const status = document.createElement('div');
    status.className = 'task-status';
    status.textContent = task.completed ? 'Status: Completed' : 'Status: Incomplete';

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editButton = createButton('edit-task secondary', 'Edit', () => fillForm(task));
    const deleteButton = createButton('delete-task danger', 'Delete', async () => {
      if (!confirm(`Delete task "${task.title}"?`)) {
        return;
      }
      try {
        setStatus('Deleting task...');
        await deleteTask(task.id);
        await loadAndRenderTasks('Task deleted.', 'success');
        if (editingTaskId === String(task.id)) {
          clearForm();
        }
      } catch (error) {
        setStatus(`Delete failed: ${error.message}`, 'error');
      }
    });
    const toggleButton = createButton('toggle-task success', task.completed ? 'Mark Incomplete' : 'Mark Complete', async () => {
      try {
        setStatus('Updating task status...');
        await toggleTask(task);
        await loadAndRenderTasks('Task updated.', 'success');
      } catch (error) {
        setStatus(`Update failed: ${error.message}`, 'error');
      }
    });

    actions.append(editButton, toggleButton, deleteButton);
    item.append(title, description, status, actions);
    elements.taskList.appendChild(item);
  }
}

async function loadAndRenderTasks(successMessage = '', successType = '') {
  try {
    state.tasks = await fetchTasks();
    renderTasks();
    setStatus(successMessage, successType);
  } catch (error) {
    setStatus(`Could not load tasks: ${error.message}`, 'error');
    state.tasks = [];
    renderTasks();
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const title = normalizeText(elements.taskTitle.value);
  const description = normalizeText(elements.taskDescription.value);
  if (!title) {
    setStatus('Task title is required.', 'error');
    return;
  }

  const taskData = {
    title,
    description,
    completed: false
  };

  try {
    if (editingTaskId) {
      const task = state.tasks.find((item) => String(item.id) === String(editingTaskId));
      const payload = {
        id: task ? task.id : Number(editingTaskId),
        ...taskData,
        completed: task ? task.completed : false
      };
      await updateTask(editingTaskId, payload);
      setStatus('Task saved successfully.', 'success');
    } else {
      await createTask(taskData);
      setStatus('Task added successfully.', 'success');
    }

    clearForm();
    await loadAndRenderTasks();
  } catch (error) {
    setStatus(`Save failed: ${error.message}`, 'error');
  }
}

async function init() {
  cacheElements();

  try {
    config = await loadConfig();
  } catch (error) {
    setStatus(`Configuration error: ${error.message}`, 'error');
    elements.taskForm?.setAttribute('aria-disabled', 'true');
    return;
  }

  elements.taskForm.addEventListener('submit', handleSubmit);
  elements.taskCancel.addEventListener('click', () => {
    clearForm();
    setStatus('Edit cancelled.', '');
  });
  elements.refreshTasks.addEventListener('click', () => loadAndRenderTasks('Tasks refreshed.', 'success'));

  await loadAndRenderTasks();
}

document.addEventListener('DOMContentLoaded', init);

const BASE_URL = 'http://127.0.0.1:8000';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token') || '',
});

const safeJson = async (res) => {
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; }
  catch { return {}; }
};

// Users
export const login = (name, password) =>
  fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password }),
  }).then(safeJson);

export const register = (data) =>
  fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(safeJson);

export const getMe = () =>
  fetch(`${BASE_URL}/users/me`, { headers: authHeaders() }).then(safeJson);

export const getUsers = () =>
  fetch(`${BASE_URL}/users/`, { headers: authHeaders() }).then(safeJson);

export const deleteUser = (id) =>
  fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE', headers: authHeaders() });

// Tasks
export const getTasks = () =>
  fetch(`${BASE_URL}/tasks/`, { headers: authHeaders() }).then(safeJson);

export const addTask = (data) =>
  fetch(`${BASE_URL}/tasks/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const completeTask = (code) =>
  fetch(`${BASE_URL}/tasks/${code}`, { method: 'PUT', headers: authHeaders() }).then(safeJson);

export const deleteTask = (code) =>
  fetch(`${BASE_URL}/tasks/${code}`, { method: 'DELETE', headers: authHeaders() });

export const assignTask = (code, people_ids) =>
  fetch(`${BASE_URL}/tasks/${code}/assign`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ people_ids }),
  }).then(safeJson);

// Projects
export const getProjects = () =>
  fetch(`${BASE_URL}/projects/`, { headers: authHeaders() }).then(safeJson);

export const addProject = (data) =>
  fetch(`${BASE_URL}/projects/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const addTaskToProject = (projectId, taskCode) =>
  fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskCode}`, {
    method: 'POST',
    headers: authHeaders(),
  }).then(safeJson);

export const removeTaskFromProject = (projectId, taskCode) =>
  fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskCode}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(safeJson);

export const deleteProject = (id) =>
  fetch(`${BASE_URL}/projects/${id}`, { method: 'DELETE', headers: authHeaders() });

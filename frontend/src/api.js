const API_BASE = "";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request(path, token, options = {}) {
  const headers = token ? authHeaders(token) : { "Content-Type": "application/json" };
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    throw new Error(errorMsg || data.message || "Request failed");
  }
  return data;
}

export function login(username, password) {
  return request("/login", null, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function register(username, password, role) {
  return request("/register", null, {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });
}

export function getProjects(token) {
  return request("/admin/projects", token);
}

export function createProject(token, project) {
  return request("/admin/projects", token, {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function updateProject(token, projectId, project) {
  return request(`/admin/projects/${projectId}`, token, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export function deleteProject(token, projectId) {
  return request(`/admin/projects/${projectId}`, token, {
    method: "DELETE",
  });
}

export function getDevelopers(token) {
  return request("/admin/developers", token);
}

export function createDeveloper(token, developer) {
  return request("/admin/developers", token, {
    method: "POST",
    body: JSON.stringify(developer),
  });
}

export function updateDeveloper(token, developerId, developer) {
  return request(`/admin/developers/${developerId}`, token, {
    method: "PUT",
    body: JSON.stringify(developer),
  });
}

export function deleteDeveloper(token, developerId) {
  return request(`/admin/developers/${developerId}`, token, {
    method: "DELETE",
  });
}

export function getAdminTasks(token) {
  return request("/admin/tasks", token);
}

export function createTask(token, task) {
  return request("/admin/tasks", token, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(token, taskId, task) {
  return request(`/admin/tasks/${taskId}`, token, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteTask(token, taskId) {
  return request(`/admin/tasks/${taskId}`, token, {
    method: "DELETE",
  });
}

export function getDeveloperTasks(token) {
  return request("/developer/tasks", token);
}

export function updateTaskStatus(token, taskId, status) {
  return request(`/developer/tasks/${taskId}?status=${encodeURIComponent(status)}`, token, {
    method: "PUT",
  });
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDevelopers,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getAdminTasks,
  createTask,
  deleteTask,
  getDeveloperTasks,
  updateTaskStatus,
} from "./api";

const DEFAULT_STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

export default function Dashboard({ token, role, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="app-shell">
      <header className="header-bar">
        <div>
          <strong>Project Management</strong> — {role.toUpperCase()} view
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>
        {role === "admin" ? (
          <AdminPanel token={token} />
        ) : (
          <DeveloperPanel token={token} />
        )}
      </main>
    </div>
  );
}

function AdminPanel({ token }) {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [developerForm, setDeveloperForm] = useState({ username: "", password: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", project_id: "", developer_id: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError("");
    try {
      const [projectsData, developersData, tasksData] = await Promise.all([
        getProjects(token),
        getDevelopers(token),
        getAdminTasks(token),
      ]);
      setProjects(projectsData);
      setDevelopers(developersData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createProject(token, projectForm);
      setMessage("Project created.");
      setProjectForm({ name: "", description: "" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeveloperSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createDeveloper(token, { ...developerForm, role: "developer" });
      setMessage("Developer created.");
      setDeveloperForm({ username: "", password: "" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createTask(token, taskForm);
      setMessage("Task created.");
      setTaskForm({ title: "", description: "", project_id: "", developer_id: "" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (deleteFn, id) => {
    setError("");
    try {
      await deleteFn(token, id);
      setMessage("Deleted successfully.");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="panel">
        <div className="panel-header">
          <h2>Projects</h2>
        </div>
        <form className="small-form" onSubmit={handleProjectSubmit}>
          <input
            placeholder="Project name"
            value={projectForm.name}
            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
          />
          <button type="submit">Add Project</button>
        </form>
        <div className="list-box">
          {projects.map((project) => (
            <div key={project.id} className="list-item">
              <div>
                <strong>{project.name}</strong>
                <p>{project.description || "No description"}</p>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(deleteProject, project.id)}>
                Delete
              </button>
            </div>
          ))}
          {projects.length === 0 && <p className="empty-state">No projects yet.</p>}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Developers</h2>
        </div>
        <form className="small-form" onSubmit={handleDeveloperSubmit}>
          <input
            placeholder="Username"
            value={developerForm.username}
            onChange={(e) => setDeveloperForm({ ...developerForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={developerForm.password}
            onChange={(e) => setDeveloperForm({ ...developerForm, password: e.target.value })}
            required
          />
          <button type="submit">Add Developer</button>
        </form>
        <div className="list-box">
          {developers.map((developer) => (
            <div key={developer.id} className="list-item">
              <div>
                <strong>{developer.username}</strong>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(deleteDeveloper, developer.id)}>
                Delete
              </button>
            </div>
          ))}
          {developers.length === 0 && <p className="empty-state">No developers yet.</p>}
        </div>
      </section>

      <section className="panel panel-large">
        <div className="panel-header">
          <h2>Tasks</h2>
        </div>
        <form className="grid-form" onSubmit={handleTaskSubmit}>
          <input
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <select
            value={taskForm.project_id}
            onChange={(e) => setTaskForm({ ...taskForm, project_id: Number(e.target.value) })}
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={taskForm.developer_id}
            onChange={(e) => setTaskForm({ ...taskForm, developer_id: Number(e.target.value) })}
            required
          >
            <option value="">Select developer</option>
            {developers.map((developer) => (
              <option key={developer.id} value={developer.id}>
                {developer.username}
              </option>
            ))}
          </select>
          <button type="submit" className="full-width">
            Create Task
          </button>
        </form>

        <div className="list-box">
          {tasks.map((task) => (
            <div key={task.id} className="list-item task-item">
              <div>
                <strong>{task.title}</strong>
                <p>{task.description || "No description"}</p>
                <p className="meta">Project: {task.project_id} · Dev: {task.developer_id} · Status: {task.status}</p>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(deleteTask, task.id)}>
                Delete
              </button>
            </div>
          ))}
          {tasks.length === 0 && <p className="empty-state">No tasks assigned yet.</p>}
        </div>
      </section>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
    </div>
  );
}

function DeveloperPanel({ token }) {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setError("");
    try {
      const data = await getDeveloperTasks(token);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setError("");
    try {
      await updateTaskStatus(token, taskId, status);
      setMessage("Task status updated.");
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="panel panel-large">
        <div className="panel-header">
          <h2>My Tasks</h2>
        </div>
        <div className="list-box">
          {tasks.map((task) => (
            <div key={task.id} className="list-item task-item">
              <div>
                <strong>{task.title}</strong>
                <p>{task.description || "No description"}</p>
                <p className="meta">Project: {task.project_id} · Status: {task.status}</p>
              </div>
              <div className="task-actions">
                {DEFAULT_STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    className={status === task.status ? "btn-secondary" : "btn-small"}
                    onClick={() => handleStatusChange(task.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="empty-state">No tasks assigned. Ask your admin to assign work.</p>}
        </div>
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Unauthorized. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/project', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch projects.');
      }
    } catch (err) {
      console.error('Fetch Projects Error:', err);
      setError('An error occurred while fetching projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/project', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectId })
      });

      if (response.ok) {
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete the project.');
      }
    } catch (err) {
      console.error('Delete Project Error:', err);
      alert('An error occurred while deleting the project.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1>Your Projects</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Your Projects</h1>
        <div className="header-actions">
          <button className="create-project-button" onClick={() => navigate('/create-project')}>
            Add Project
          </button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!error && projects.length === 0 && (
        <div className="no-projects-message">
          <p>You have no projects. Start one now!</p>
          <button className="create-project-button" onClick={() => navigate('/create-project')}>
            Create a New Project
          </button>
        </div>
      )}

      {!error && projects.length > 0 && (
        <ul className="project-list">
          {projects.map(project => (
            <li key={project.id} className="project-item">
              <h3>{project.title.replace(/_/g, ' ')}</h3>
              <p>Words Completed: {project.progress}</p>
              <div className="project-actions">
                <button
                  className="view-button"
                  onClick={() => navigate(`/project/${project.id}`, { state: { completedWords: project.progress } })}
                >
                  View
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
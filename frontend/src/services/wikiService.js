export const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Unified API call function with error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} - ${errorText}`);
  }
  
  return response.json();
};

// Fetch project content by ID
export const fetchProjectContent = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const data = await fetchWithErrorHandling(
      `${API_BASE_URL}/project-content/id?id=${projectId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return {
      id: data.id,
      project_id: data.project_id,
      content: data.content || ''
    };
  } catch (error) {
    console.error('Error fetching project content:', error);
    throw error;
  }
};

// Create new project from Wikipedia URL
export const createWikiProject = async (wikiUrl) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const payload = { link: wikiUrl };
    console.log('Creating project with payload:', payload);

    const project = await fetchWithErrorHandling(
      `${API_BASE_URL}/project`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    await delay(2000); // Wait for content processing
    return project;
  } catch (error) {
    console.error('Error creating wiki project:', error);
    throw error;
  }
};

// Fetch project by ID with content
export const fetchWikiProject = async (projectId) => {
  try {
    const [project, content] = await Promise.all([
      fetchWithErrorHandling(`${API_BASE_URL}/project/id?id=${projectId}`),
      fetchProjectContent(projectId)
    ]);
    return { ...project, content: content.content };
  } catch (error) {
    console.error('Error fetching wiki project:', error);
    throw error;
  }
};

// Fetch project by title
export const getProjectByTitle = async (title) => {
  try {
    const project = await fetchWithErrorHandling(`${API_BASE_URL}/project/title?title=${encodeURIComponent(title)}`);
    const content = await fetchProjectContent(project.id);
    return { ...project, content: content.content };
  } catch (error) {
    console.error('Error fetching project by title:', error);
    throw error;
  }
};

// Get all projects
export const getAllProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    return await fetchWithErrorHandling(
      `${API_BASE_URL}/project`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
};

// Delete project by ID
export const deleteProject = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    return await fetchWithErrorHandling(
      `${API_BASE_URL}/project`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: projectId })
      }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Save progress data
export const saveProgress = async (progressData, totalWords) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    const progressPercent = (progressData.completedWords / totalWords) * 100;

    const updatedProgressData = {
      ...progressData,
      progress: progressData.completedWords,
      progress_percent: progressPercent
    };

    console.log('Saving progress with data:', updatedProgressData); // Debugging log

    return await fetchWithErrorHandling(
      `${API_BASE_URL}/project/progress`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProgressData)
      }
    );
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};
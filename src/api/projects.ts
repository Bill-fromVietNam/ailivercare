import apiService from './index';

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  status?: string;
  progress?: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: string;
  progress?: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
}

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  return await apiService.get('/projects');
};

// Get a single project
export const getProject = async (id: number): Promise<Project> => {
  return await apiService.get(`/projects/${id}`);
};

// Create a project
export const createProject = async (project: ProjectCreate): Promise<Project> => {
  return await apiService.post('/projects', project);
};

// Update a project
export const updateProject = async (id: number, project: ProjectUpdate): Promise<Project> => {
  return await apiService.put(`/projects/${id}`, project);
};

// Delete a project
export const deleteProject = async (id: number): Promise<{ success: boolean; message: string }> => {
  return await apiService.delete(`/projects/${id}`);
};

// Get project statistics
export const getProjectStats = async (): Promise<ProjectStats> => {
  return await apiService.get('/projects/stats');
};

// Get tasks for a project
export const getProjectTasks = async (projectId: number): Promise<any[]> => {
  return await apiService.get(`/projects/${projectId}/tasks`);
}; 
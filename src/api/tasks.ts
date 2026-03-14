import apiService from './index';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;  // pending, in_progress, completed
  priority: string;  // low, medium, high
  due_date?: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  project_id: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  project_id?: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  priority: {
    high: number;
    medium: number;
    low: number;
  };
}

// Get all tasks with optional status filter
export const getTasks = async (status?: string): Promise<Task[]> => {
  const params = status ? { status } : {};
  return await apiService.get('/tasks', { params });
};

// Get a single task
export const getTask = async (id: number): Promise<Task> => {
  return await apiService.get(`/tasks/${id}`);
};

// Create a task
export const createTask = async (task: TaskCreate): Promise<Task> => {
  return await apiService.post('/tasks', task);
};

// Update a task
export const updateTask = async (id: number, task: TaskUpdate): Promise<Task> => {
  return await apiService.put(`/tasks/${id}`, task);
};

// Delete a task
export const deleteTask = async (id: number): Promise<{ success: boolean; message: string }> => {
  return await apiService.delete(`/tasks/${id}`);
};

// Get task statistics
export const getTaskStats = async (): Promise<TaskStats> => {
  return await apiService.get('/tasks/stats');
}; 
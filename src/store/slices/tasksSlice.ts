import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as tasksApi from '../../api/tasks'

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  due_date?: string;
  project_id: number;
  created_at: string;
  updated_at: string;
  // Thêm trường này để tương thích với type cũ
  project: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (status?: string) => {
    const tasks = await tasksApi.getTasks(status);
    // Biến đổi dữ liệu để phù hợp với interface Task
    return tasks.map((task: tasksApi.Task) => ({
      ...task,
      project: `Project ID: ${task.project_id}` // Tạm thời tạo một giá trị cho field project
    }));
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: tasksApi.TaskCreate) => {
    const newTask = await tasksApi.createTask(task);
    return {
      ...newTask,
      project: `Project ID: ${newTask.project_id}`
    };
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: number; task: tasksApi.TaskUpdate }) => {
    const updatedTask = await tasksApi.updateTask(id, task);
    return {
      ...updatedTask,
      project: `Project ID: ${updatedTask.project_id}`
    };
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number) => {
    await tasksApi.deleteTask(id);
    return id;
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasksError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải danh sách nhiệm vụ';
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tạo nhiệm vụ mới';
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể cập nhật nhiệm vụ';
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể xóa nhiệm vụ';
      });
  },
})

export const { clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as projectsApi from '../../api/projects'

export interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
}

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    return await projectsApi.getProjects();
  }
)

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (project: projectsApi.ProjectCreate) => {
    return await projectsApi.createProject(project);
  }
)

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, project }: { id: number; project: projectsApi.ProjectUpdate }) => {
    return await projectsApi.updateProject(id, project);
  }
)

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: number) => {
    await projectsApi.deleteProject(id);
    return id;
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải danh sách dự án';
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tạo dự án mới';
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể cập nhật dự án';
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể xóa dự án';
      });
  },
})

export const { clearProjectsError } = projectsSlice.actions;
export default projectsSlice.reducer; 
import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from './slices/projectsSlice'
import tasksReducer from './slices/tasksSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

export default function useAuth() {
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    isLoggedIn: isAuthenticated
  }
} 
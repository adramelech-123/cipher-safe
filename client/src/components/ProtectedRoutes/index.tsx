import { useAuthStore } from "@/store/authStore"
import { Navigate, Outlet } from "react-router-dom";


interface AuthState {
  isAuthenticated: boolean,
  user: {isVerified: boolean} | null
}

const ProtectedRoutes = () => {
  const {isAuthenticated, user} = useAuthStore() as AuthState

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet/>;
}

export default ProtectedRoutes
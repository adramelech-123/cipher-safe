import { useAuthStore } from "@/store/authStore"
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: ReactNode
}

interface AuthState {
  isAuthenticated: boolean,
  user: {isVerified: boolean} | null
}

const ProtectedRoutes = ({children}: ProtectedRoutesProps) => {
  const {isAuthenticated, user} = useAuthStore() as AuthState

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
export default ProtectedRoutes
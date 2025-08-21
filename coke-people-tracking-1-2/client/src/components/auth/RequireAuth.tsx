import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/auth/useAuth";

type RequireAuthProps = {
  allowedRoles: string[];
};

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { user } = useAuth();
  const location = useLocation();

  return allowedRoles.includes(user?.role || "") ? (
    <Outlet />
  ) : user?.name ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;

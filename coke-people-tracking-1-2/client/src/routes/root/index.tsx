import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import useLogout from "@/hooks/auth/useLogout";

const Root = () => {
  const location = useLocation();
  const routesToExclude = ["/login", "/unauthorized"];
  const logout = useLogout();

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await logout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return routesToExclude.includes(location.pathname) ? (
    <Outlet />
  ) : (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default Root;

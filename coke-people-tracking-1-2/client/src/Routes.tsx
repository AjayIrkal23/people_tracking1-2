import PersistLogin from "@/components/auth/PersistentLogin";
import RequireAuth from "@/components/auth/RequireAuth";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// routes
import Root from "@/routes/root";
import Login from "@/routes/user/login";
import ErrorPage from "./routes/error";
import UnauthorizedPage from "./routes/unauthorized";
import Dashboard from "@/routes/dashboard";
import Users from "@/routes/user";
import DevicesPage from "@/routes/devices";
import ViolationsPage from "./routes/violations";
import LogsPage from "./routes/logs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // public routes
      { path: "login", element: <Login /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },

      // protected routes
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth allowedRoles={["USER", "ADMIN"]} />,
            children: [
              { path: "users", element: <Users /> },
              { path: "", element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "devices", element: <DevicesPage /> },
              { path: "violations", element: <ViolationsPage /> },
              { path: "logs", element: <LogsPage /> },
            ],
          },
          {
            element: <RequireAuth allowedRoles={["ADMIN"]} />,
            children: [
              { path: "", element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "users", element: <Users /> },
              { path: "devices", element: <DevicesPage /> },
              { path: "violations", element: <ViolationsPage /> },
              { path: "logs", element: <LogsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;

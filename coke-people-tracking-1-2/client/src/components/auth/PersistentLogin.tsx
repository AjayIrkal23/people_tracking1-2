import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/auth/useRefreshToken";
import useAuth from "@/hooks/auth/useAuth";
import { Spin } from "antd";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    !user?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  const loadingContainerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      {isLoading ? (
        <div style={loadingContainerStyle}>
          <Spin />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;

import axios from "@/api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setUser } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/user/refresh", {
      withCredentials: true,
    });
    setUser((prev) => {
      return {
        ...prev,
        _id: response.data._id,
        name: response.data.name,
        role: response.data.role,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;

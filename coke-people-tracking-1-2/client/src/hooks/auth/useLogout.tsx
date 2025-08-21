import axios from "@/api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setUser } = useAuth();

  const logout = async () => {
    setUser(null);
    try {
      await axios.post("/user/logout", null, {
        withCredentials: true,
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return logout;
};

export default useLogout;

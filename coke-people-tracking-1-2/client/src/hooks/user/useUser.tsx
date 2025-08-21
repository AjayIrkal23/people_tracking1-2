import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { User } from "@/interfaces/user";
import { message } from "antd";

const useUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<User[]>("/user/all");
      setUsers(response.data);
    } catch (error) {
      if (error instanceof Error) {
        message.error(
          error.message || "An error occurred while fetching users"
        );
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, fetchUsers };
};

export default useUser;

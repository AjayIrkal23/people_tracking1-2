import UsersTable from "./UsersTable";
import RegisterUser from "./RegisterUser";
import useUser from "@/hooks/user/useUser";

const Users: React.FC = () => {
  const { users, loading, fetchUsers } = useUser();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <RegisterUser fetchUsers={fetchUsers} />
      </div>
      <UsersTable users={users} loading={loading} onRefresh={fetchUsers} />
    </div>
  );
};

export default Users;

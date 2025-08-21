import { useContext, useState } from "react";
import useAuth from "@/hooks/auth/useAuth";
import RegisterGateway from "./GatewayRegister";
import GatewaysTable from "./GatewaysTable";
import DeleteGateway from "./GatewayDelete";
import useGateway from "@/hooks/useGateway";
import { DeleteGatewayType } from "@/interfaces/device";
import DeviceContext from "@/context/DeviceContext";

const Gateways = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { loading } = useGateway();
  const { gateways, fetchGateways } = useContext(DeviceContext);
  const [deleteGateway, setDeleteGateway] = useState<DeleteGatewayType>({
    open: false,
    gwid: null,
  });

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <RegisterGateway fetchGateways={fetchGateways} />
        </div>
      )}
      <GatewaysTable
        gateways={gateways}
        loading={loading}
        fetchGateways={fetchGateways}
        setDeleteGateway={setDeleteGateway}
      />
      <DeleteGateway
        fetchGateways={fetchGateways}
        deleteGateway={deleteGateway}
        setDeleteGateway={setDeleteGateway}
      />
    </>
  );
};

export default Gateways;

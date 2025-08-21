import { useContext, useState } from "react";
import RegisterConnectPoint from "./ConnectPointRegister";
import ConnectPointsTable from "./ConnectPointsTable";
import DeleteConnectPoint from "./ConnectPointDelete";
import { DeleteConnectPointType } from "@/interfaces/device";
import useConnectPoint from "../../../hooks/useConnectPoint";
import useAuth from "@/hooks/auth/useAuth";
import DeviceContext from "@/context/DeviceContext";

const ConnectPoints = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { loading } = useConnectPoint();
  const { connectPoints, fetchConnectPoints } = useContext(DeviceContext);
  const [deleteConnectPoint, setDeleteConnectPoint] =
    useState<DeleteConnectPointType>({
      open: false,
      cpid: null,
    });

  return (
    <>
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <RegisterConnectPoint fetchConnectPoints={fetchConnectPoints} />
        </div>
      )}
      <ConnectPointsTable
        connectPoints={connectPoints}
        loading={loading}
        fetchConnectPoints={fetchConnectPoints}
        setDeleteConnectPoint={setDeleteConnectPoint}
      />
      <DeleteConnectPoint
        fetchConnectPoints={fetchConnectPoints}
        deleteConnectPoint={deleteConnectPoint}
        setDeleteConnectPoint={setDeleteConnectPoint}
      />
    </>
  );
};

export default ConnectPoints;

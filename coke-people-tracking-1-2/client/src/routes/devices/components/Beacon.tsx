import { useContext, useState } from "react";
import RegisterBeacon from "./BeaconRegister";
import BeaconsTable from "./BeaconsTable";
import useBeacon from "@/hooks/useBeacon";
import useAuth from "@/hooks/auth/useAuth";
import useAssignmentHistory from "../hooks/useAssignmentHIstory";
import { AssignEmployeeType, DeleteBeaconType } from "@/interfaces/device";
import AssignEmployeeToBeacon from "./BeaconAssignEmployee";
import DeleteBeacon from "./BeaconDelete";
import AssignmentHistoryTable from "./AssignmentHistoryTable"; // Add this
import DeviceContext from "@/context/DeviceContext";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";

const Beacons = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { loading: beaconLoading } = useBeacon();
  const { beacons, fetchBeacons } = useContext(DeviceContext);

  // Add assignment history hook
  const { assignmentHistory, loading: historyLoading } = useAssignmentHistory();

  const [deleteBeacon, setDeleteBeacon] = useState<DeleteBeaconType>({
    open: false,
    bnid: null,
  });

  const [assignEmployee, setAssignEmployee] = useState<AssignEmployeeType>({
    open: false,
    bnid: null,
  });

  const [table, setTable] = useState("beacons");

  const onTableChange = (e: RadioChangeEvent) => {
    setTable(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        {isAdmin && <RegisterBeacon fetchBeacons={fetchBeacons} />}
        <Radio.Group
          onChange={onTableChange}
          value={table}
          className="shadow-md rounded-md p-2 bg-white"
        >
          <Radio.Button value="beacons">Registered Beacons</Radio.Button>
          <Radio.Button value="assignment">Assignment History</Radio.Button>
        </Radio.Group>
      </div>

      {table === "beacons" ? (
        <>
          <BeaconsTable
            beacons={beacons}
            loading={beaconLoading}
            fetchBeacons={fetchBeacons}
            setAssignEmployee={setAssignEmployee}
            setDeleteBeacon={setDeleteBeacon}
          />
          <AssignEmployeeToBeacon
            fetchBeacons={fetchBeacons}
            assignEmployee={assignEmployee}
            setAssignEmployee={setAssignEmployee}
          />
          <DeleteBeacon
            fetchBeacons={fetchBeacons}
            deleteBeacon={deleteBeacon}
            setDeleteBeacon={setDeleteBeacon}
          />
        </>
      ) : (
        <AssignmentHistoryTable
          assignmentHistory={assignmentHistory}
          loading={historyLoading}
        />
      )}
    </>
  );
};

export default Beacons;

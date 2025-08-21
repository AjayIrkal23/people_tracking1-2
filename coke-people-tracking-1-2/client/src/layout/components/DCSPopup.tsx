import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { Beacon } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";

interface DCSPopupState {
  open: boolean;
  beacon: Beacon | null;
}

interface DCSPopupProps {
  dcsPopup: DCSPopupState;
  handleOk: () => void;
}

const DCSPopup: React.FC<DCSPopupProps> = ({ dcsPopup, handleOk }) => {
  const { beacon } = dcsPopup;
  const axiosPrivate = useAxiosPrivate();
  const [newEmployee, setNewEmployee] = useState("");

  const handleAssignEmployee = async () => {
    if (!beacon || !newEmployee) return;

    try {
      await axiosPrivate.patch("/beacon/assignEmployee", {
        bnid: beacon.bnid,
        employeeName: newEmployee,
      });
      setNewEmployee("");
      handleOk();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Modal
      title="Beacon Details"
      open={dcsPopup.open}
      footer={null}
      centered
      width={350}
    >
      {beacon ? (
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            lineHeight: "2rem",
            padding: "20px",
          }}
        >
          <p className="text-green-500 font-bold text-3xl">
            <span className="font-bold text-3xl">ID:</span> {beacon.bnid}
          </p>
          <p
            className="text-blue-500 font-bold text-3xl"
            style={{
              color: beacon.status === "SOS" ? "#f44336" : "",
            }}
          >
            <span className="font-bold text-3xl">Status:</span> {beacon.status}
          </p>
          <p className="text-orange-500 font-bold text-3xl">
            <span className="font-bold text-3xl">Battery:</span>{" "}
            {beacon.battery}%
          </p>
          <p className="text-red-500 font-bold text-3xl">
            <span className="font-bold text-3xl">User:</span>
            <br />
            {beacon.assignedEmployee}
          </p>
          <br />
          <p className="text-green-500 font-bold text-3xl">
            <Input
              className="text-center text-2xl"
              placeholder="New User"
              value={newEmployee}
              onChange={(e) => setNewEmployee(e.target.value)}
            />
          </p>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "#f44336",
            fontSize: "1.5rem",
            padding: "20px",
          }}
        >
          No beacon data available.
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Button type="primary" size="large" onClick={handleAssignEmployee}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default DCSPopup;

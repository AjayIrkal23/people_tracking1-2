import { useState, useContext } from "react";
import { Button, Modal, DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import DeviceContext from "@/context/DeviceContext";
import MapContext from "@/context/MapContext";
import useBeaconPath from "@/hooks/useBeaconPath";
import { Battery } from "@/interfaces/map";
import { BeaconPath } from "@/interfaces/device";

interface BeaconPathTrackerProps {
  onPathFetched: (path: BeaconPath[]) => void;
  onClearPath: () => void;
  tracking: boolean;
}

const BeaconPathTracker: React.FC<BeaconPathTrackerProps> = ({
  onPathFetched,
  onClearPath,
  tracking,
}) => {
  const { beacons } = useContext(DeviceContext);
  const { setLocation } = useContext(MapContext);
  const { fetchPath, loading } = useBeaconPath();

  const [open, setOpen] = useState(false);
  const [bnid, setBnid] = useState<number | null>(null);
  const [battery, setBattery] = useState<Battery>(Battery.one);
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const handleOk = async () => {
    if (!bnid || !date) return;
    const result = await fetchPath(bnid, date.format("YYYY-MM-DD"), battery);
    onPathFetched(result);
    setLocation(battery);
    setOpen(false);
  };

  if (tracking)
    return (
      <Button
        className="absolute top-2 right-48 z-50"
        type="primary"
        danger
        onClick={onClearPath}
      >
        Clear Path
      </Button>
    );

  return (
    <>
      <Button
        className="absolute top-2 right-48 z-50"
        type="primary"
        onClick={() => setOpen(true)}
      >
        Track Path
      </Button>
      <Modal
        title="Track Beacon Path"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Fetch"
        confirmLoading={loading}
      >
        <div className="flex flex-col gap-4">
          <DatePicker
            value={date}
            onChange={(d) => setDate(d)}
            className="w-full"
          />
          <Select
            value={battery}
            onChange={(value) => setBattery(value)}
            options={[
              { value: Battery.one, label: "Battery 1" },
              { value: Battery.two, label: "Battery 2" },
            ]}
            className="w-full"
          />
          <Select
            value={bnid ?? undefined}
            onChange={(value) => setBnid(value)}
            placeholder="Select Beacon"
            options={beacons.map((b) => ({ value: b.bnid, label: `0${b.bnid}` }))}
            className="w-full"
          />
        </div>
      </Modal>
    </>
  );
};

export default BeaconPathTracker;

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import Beacons from "./components/Beacon";
import ConnectPoints from "./components/ConnectPoints";
import Gateways from "./components/Gateways";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Beacons",
    children: <Beacons />,
  },
  {
    key: "2",
    label: "Connect Points",
    children: <ConnectPoints />,
  },
  {
    key: "3",
    label: "Gateways",
    children: <Gateways />,
  },
];

const DevicesPage = () => {
  return <Tabs centered defaultActiveKey="1" className="mt-2" items={items} />;
};

export default DevicesPage;

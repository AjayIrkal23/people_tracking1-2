import { Tabs } from "antd";
const { TabPane } = Tabs;
import ConnectPointLogs from "./components/ConnectPointLogs";
import AllLogs from "./components/AllLogs";

const LogsPage = () => {
  return (
    <Tabs centered defaultActiveKey="1" className="mt-2">
      <TabPane tab="Connect Points" key="1">
        <ConnectPointLogs />
      </TabPane>
      <TabPane tab="All Events" key="2">
        <AllLogs />
      </TabPane>
    </Tabs>
  );
};

export default LogsPage;

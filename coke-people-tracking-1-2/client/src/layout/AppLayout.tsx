import { useEffect, useState, useMemo } from "react";
import useAuth from "@/hooks/auth/useAuth";
import NavbarOptions from "@/layout/components/NavbarOptions";
import jsw_logo from "/jsw_logo.png";
import { IoHardwareChipOutline } from "react-icons/io5";
import {
  DesktopOutlined,
  UserOutlined,
  SettingOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { CiViewTable } from "react-icons/ci";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
const { Header, Content, Sider } = Layout;
import { Link } from "react-router-dom";
import { usePolling } from "@/hooks/usePolling";
import { useContext } from "react";
import DeviceContext from "@/context/DeviceContext";
import AlarmNotification from "./components/AlarmNotification";
import GatewayInactiveNotification from "./components/GatewayInactiveNotification";
import DCSPopup from "./components/DCSPopup";
import { Beacon, BeaconLocation } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import ActiveUserList from "./components/ActiveUserList";
import MapContext from "@/context/MapContext";
import EartkeyLogo from "./components/EartkeyLogo";
import DocketRunLogo from "./components/DocketRunLogo";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const userItems: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <DesktopOutlined />),
  getItem(<Link to="/devices">Devices</Link>, "2", <IoHardwareChipOutline />),
  getItem(<Link to="/violations">Violations</Link>, "3", <AlertOutlined />),
  getItem(<Link to="/logs">Logs</Link>, "4", <CiViewTable />),
];

const adminItems: MenuItem[] = [
  getItem(<Link to="/">Dashboard</Link>, "1", <DesktopOutlined />),
  getItem(<Link to="/devices">Devices</Link>, "2", <IoHardwareChipOutline />),
  getItem(<Link to="/violations">Violations</Link>, "3", <AlertOutlined />),
  getItem(<Link to="/logs">Logs</Link>, "4", <CiViewTable />),
  getItem("Admin", "sub1", <SettingOutlined />, [
    getItem(<Link to="/users">Users</Link>, "5", <UserOutlined />),
  ]),
];

type LayoutProps = {
  children: React.ReactNode;
};

interface DCSPopupState {
  open: boolean;
  beacon: Beacon | null;
}

const LayoutComponent = ({ children }: LayoutProps): JSX.Element => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { beacons, fetchBeacons, gateways, fetchGateways } =
    useContext(DeviceContext);
  const { isFullScreen, location } = useContext(MapContext);
  const [dcsPopup, setDcsPopup] = useState<DCSPopupState>({
    open: false,
    beacon: null,
  });
  const axiosPrivate = useAxiosPrivate();

  const notificationBeacons = useMemo(
    () => beacons.filter((b) => b.status === "SOS" || b.status === "IDLE"),
    [beacons]
  );

  const showModal = (beacon: Beacon) => {
    setDcsPopup({ open: true, beacon });
  };

  const handleOk = async () => {
    try {
      if (dcsPopup.beacon) {
        const res = await axiosPrivate.post("/beacon/reset", {
          bnid: dcsPopup.beacon.bnid,
        });
        if (res.status === 200) {
          setDcsPopup({ open: false, beacon: null });
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    beacons.map((beacon) => {
      if (beacon.location === BeaconLocation.dcsRoom) {
        showModal(beacon);
      }
    });
  }, [beacons]);

  usePolling(fetchBeacons, 300);
  usePolling(fetchGateways, 60000);

  return (
    <Layout className="h-screen">
      <Sider theme="light">
        {!isFullScreen && <DocketRunLogo />}
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={isAdmin ? adminItems : userItems}
        />
        <ActiveUserList beacons={beacons} />
      </Sider>
      <Layout className="flex flex-col flex-1 overflow-hidden">
        <Header
          className="p-0 flex justify-between items-center shadow-md"
          style={{
            background: colorBgContainer,
          }}
        >
          <div className="flex items-center">
            <img
              src={jsw_logo}
              alt="Company Logo"
              className="w-32 md:w-44 pl-2"
            />
          </div>
          <div className="hidden md:block ml-4 font-extrabold">
            <span className="text-black">
              {" "}
              Coke Oven 3 - {location.toUpperCase()}
            </span>{" "}
          </div>
          <NavbarOptions />
        </Header>
        <Content className="m-4 overflow-auto flex-1">{children}</Content>
      </Layout>
      {!isFullScreen && <AlarmNotification beacons={notificationBeacons} />}
      <GatewayInactiveNotification gateways={gateways} />
      <DCSPopup dcsPopup={dcsPopup} handleOk={handleOk} />
      {!isFullScreen && <EartkeyLogo />}
    </Layout>
  );
};

export default LayoutComponent;

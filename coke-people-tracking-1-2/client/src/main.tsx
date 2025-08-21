import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { DeviceProvider } from "./context/DeviceContext";
import { MapProvider } from "./context/MapContext";
import { ConfigProvider } from "antd";
import { COLOR_PRIMARY } from "./constants";
import { buildProvidersTree } from "./helpers/buildProvidersTree";
import "./index.css";

const antdThemeConfig = {
  token: {
    colorPrimary: COLOR_PRIMARY,
  },
};

const ProvidersTree = buildProvidersTree([
  [ConfigProvider, { theme: antdThemeConfig }],
  [AuthProvider, {}],
  [MapProvider, {}],
  [DeviceProvider, {}],
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ProvidersTree>
    <Routes />
  </ProvidersTree>
);

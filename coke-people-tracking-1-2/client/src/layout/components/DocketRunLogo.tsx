import logo from "/logo.png";
import { useContext } from "react";
import MapContext from "@/context/MapContext";

const DocketRunLogo = () => {
  const { isFullScreen } = useContext(MapContext);

  return (
    <div
      className={`flex justify-center items-center h-20 p-4 w-52 z-[9999] ${
        isFullScreen ? "absolute" : ""
      } `}
    >
      <img src={logo} alt="Company Logo" />
    </div>
  );
};

export default DocketRunLogo;

import { Button, Tooltip } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { GrPowerReset } from "react-icons/gr";
import { MdFullscreen } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { capitalizeFirstLetterOfEachWord } from "@/helpers/capitalizeFirstLetterOfEachWord";
import { useControls } from "react-zoom-pan-pinch";
import useAuth from "@/hooks/auth/useAuth";

interface TransformControlProps {
  enterFullscreen: () => void;
  toggleShowBoundingBox: () => void;
}

interface TransformButtonProps {
  type: "zoom in" | "zoom out" | "reset" | "full screen" | "bounding box";
  onClick: () => void;
}

const TransformButton: React.FC<TransformButtonProps> = ({ type, onClick }) => {
  const icon = {
    "zoom in": <ZoomInOutlined />,
    "zoom out": <ZoomOutOutlined />,
    reset: <GrPowerReset />,
    "full screen": <MdFullscreen />,
    "bounding box": <FaEye />,
  };

  return (
    <Tooltip title={capitalizeFirstLetterOfEachWord(type)} placement="left">
      <Button
        type="default"
        shape="default"
        icon={icon[type]}
        onClick={onClick}
        size="large"
        className="shadow-custom"
      />
    </Tooltip>
  );
};

const TransformControls: React.FC<TransformControlProps> = ({
  enterFullscreen,
  toggleShowBoundingBox,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute flex flex-col h-full justify-center gap-3 z-40 bottom-4 right-4 mr-2">
      {isAdmin && (
        <TransformButton
          type="bounding box"
          onClick={() => toggleShowBoundingBox()}
        />
      )}
      <TransformButton type="full screen" onClick={() => enterFullscreen()} />
      <TransformButton type="zoom in" onClick={() => zoomIn()} />
      <TransformButton type="zoom out" onClick={() => zoomOut()} />
      <TransformButton type="reset" onClick={() => resetTransform()} />
    </div>
  );
};

export default TransformControls;

import { useState, useEffect, useContext } from "react";
import { BATTERY_1_MAP_IMAGE, BATTERY_2_MAP_IMAGE } from "@/constants";
import { Stage, Layer, Image, Line } from "react-konva";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";
import CellarBeacons from "./CellarBeacons";
import CellarConnectPoints from "./CellarConnectPoints";
import CellarGateways from "./CellarGateways";
import CellarBoundingBox from "./CellarBoundingBox";
import { BoundingBoxState } from "@/interfaces/device";
import DeviceContext from "@/context/DeviceContext";
import MapContext from "@/context/MapContext";

interface CellarAreaMapProps {
  addBoundingBox: BoundingBoxState;
  showBoundingBox: boolean;
}

const CellarAreaMap: React.FC<CellarAreaMapProps> = ({
  addBoundingBox,
  showBoundingBox,
}) => {
  const canvasMeasures = useCalculateCanvasMeasures();
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const { location } = useContext(MapContext);
  const {
    beacons,
    connectPoints,
    gateways,
    fetchConnectPoints,
    fetchGateways,
  } = useContext(DeviceContext);

  const imageSrc = {
    "battery 1": BATTERY_1_MAP_IMAGE,
    "battery 2": BATTERY_2_MAP_IMAGE,
  };

  useEffect(() => {
    const { width, height } = canvasMeasures;

    const imageToLoad = new window.Image();
    imageToLoad.src = imageSrc[location];
    imageToLoad.width = width;
    imageToLoad.height = height;
    imageToLoad.onload = () => {
      setImage(imageToLoad);
      console.log(imageToLoad.src);
    };

    return () => {
      imageToLoad.onload = null;
    };
  }, [canvasMeasures, location]);

  return (
    <div className="relative">
      <Stage width={canvasMeasures.width} height={canvasMeasures.height}>
        <Layer>
          <Image image={image} />
          {addBoundingBox.points.length > 0 && (
            <Line
              points={addBoundingBox.points}
              stroke="blue"
              strokeWidth={2}
              closed={addBoundingBox.points.length === 8}
            />
          )}
          {showBoundingBox && (
            <CellarBoundingBox connectPoints={connectPoints} />
          )}
        </Layer>
      </Stage>
      <CellarBeacons beacons={beacons} />
      <CellarConnectPoints
        connectPoints={connectPoints}
        fetchConnectPoints={fetchConnectPoints}
      />
      <CellarGateways gateways={gateways} fetchGateways={fetchGateways} />
    </div>
  );
};

export default CellarAreaMap;

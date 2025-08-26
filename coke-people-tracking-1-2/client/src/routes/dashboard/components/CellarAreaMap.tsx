import { useState, useEffect, useContext, useMemo } from "react";
import { BATTERY_1_MAP_IMAGE, BATTERY_2_MAP_IMAGE } from "@/constants";
import { Stage, Layer, Image, Line } from "react-konva";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";
import CellarBeacons from "./CellarBeacons";
import CellarConnectPoints from "./CellarConnectPoints";
import CellarGateways from "./CellarGateways";
import CellarBoundingBox from "./CellarBoundingBox";
import { BoundingBoxState, BeaconPath } from "@/interfaces/device";
import DeviceContext from "@/context/DeviceContext";
import MapContext from "@/context/MapContext";

interface CellarAreaMapProps {
  addBoundingBox: BoundingBoxState;
  showBoundingBox: boolean;
  path: BeaconPath[];
}

const CellarAreaMap: React.FC<CellarAreaMapProps> = ({
  addBoundingBox,
  showBoundingBox,
  path,
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

  const pathPoints = useMemo(() => {
    if (!path || path.length === 0) return [] as number[];
    return path
      .map((p) => {
        const coords = p.latestBoundingBox.map((value, index) =>
          index % 2 === 0
            ? value * canvasMeasures.width
            : value * canvasMeasures.height
        );
        const xs = [coords[0], coords[2], coords[4], coords[6]];
        const ys = [coords[1], coords[3], coords[5], coords[7]];
        const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
        const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
        return [centerX, centerY];
      })
      .flat();
  }, [path, canvasMeasures.width, canvasMeasures.height]);

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
          {pathPoints.length > 0 && (
            <Line
              points={pathPoints}
              stroke="red"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
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

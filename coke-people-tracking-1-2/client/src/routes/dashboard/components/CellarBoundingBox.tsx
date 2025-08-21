import { Line } from "react-konva";
import { ConnectPoint } from "@/interfaces/device";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";

interface CellarBoundingBoxProps {
  connectPoints: ConnectPoint[];
}

interface BoundingBoxProps {
  points: number[];
}

const BoundingBox: React.FC<BoundingBoxProps> = ({ points }) => {
  return <Line points={points} stroke="green" strokeWidth={2} closed />;
};

const CellarBoundingBox: React.FC<CellarBoundingBoxProps> = ({
  connectPoints,
}) => {
  const canvasMeasures = useCalculateCanvasMeasures();

  const cpConfig = connectPoints
    .filter((connectPoint) => connectPoint.boundingBoxOnMap)
    .map((connectPoint) => {
      const { boundingBoxOnMap } = connectPoint;
      const pixelBoundingBox = boundingBoxOnMap.map((value, index) =>
        index % 2 === 0
          ? value * canvasMeasures.width
          : value * canvasMeasures.height
      );

      return {
        cpid: connectPoint.cpid,
        pixelBoundingBox,
      };
    });

  return cpConfig.map((config) => (
    <BoundingBox points={config.pixelBoundingBox} />
  ));
};

export default CellarBoundingBox;

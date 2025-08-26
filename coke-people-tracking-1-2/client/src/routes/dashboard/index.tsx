import { useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import CellarAreaMap from "./components/CellarAreaMap";
import TransformControls from "./components/TransformControls";

import { useFullscreen } from "./hooks/useFullscreen";
import useAddGateway from "./hooks/useAddGateway";
import useAddConnectPoint from "./hooks/useAddConnectPoint";
import useAddBoundingBox from "./hooks/useAddBoundingBox";
import DeviceContext from "@/context/DeviceContext";
import AlarmNotification from "@/layout/components/AlarmNotification";
import { usePolling } from "@/hooks/usePolling";
import ActiveUserList from "@/layout/components/ActiveUserList";
import MapContext from "@/context/MapContext";
import SelectCellar from "./components/SelectCellar";
import BeaconPathTracker from "./components/BeaconPathTracker";
import { BeaconPath } from "@/interfaces/device";

const Dashboard: React.FC = () => {
  const { ref, transformWrapperRef, enterFullscreen } = useFullscreen();
  const { scale, setScale, isFullScreen, location } = useContext(MapContext);
  const { addGateway, handleAddGateway } = useAddGateway();
  const { addConnectPoint, handleAddConnectPoint } = useAddConnectPoint();
  const {
    addBoundingBox,

    handleAddBoundingBox,
    showBoundingBox,
    toggleShowBoundingBox,
  } = useAddBoundingBox();
  const { beacons, fetchConnectPoints, fetchGateways } = useContext(DeviceContext);
  const [path, setPath] = useState<BeaconPath[]>([]);

  usePolling(fetchConnectPoints, 3000);
  usePolling(fetchGateways, 3000);

  useEffect(() => {
    setPath([]);
  }, [location]);

  const handleMapClick = (event: React.MouseEvent) => {
    if (addGateway.active) handleAddGateway(event);
    else if (addConnectPoint.active) handleAddConnectPoint(event);
    else if (addBoundingBox.active) handleAddBoundingBox(event);
  };

  return (
    <div>
      <div
        ref={ref}
        className={clsx("w-full h-full shadow-custom", {
          "bg-white": isFullScreen,
        })}
        onClick={handleMapClick}
      >
        <TransformWrapper
          ref={transformWrapperRef}
          initialScale={scale}
          onTransformed={(e) => setScale(e.instance.transformState.scale)}
          initialPositionX={0}
          initialPositionY={0}
          limitToBounds={false}
          doubleClick={{ disabled: true }}
        >
          {() => (
            <div className="relative w-full h-full">
              <TransformControls
                enterFullscreen={enterFullscreen}
                toggleShowBoundingBox={toggleShowBoundingBox}
              />

              {isFullScreen && <AlarmNotification beacons={beacons} />}
              {isFullScreen && <ActiveUserList beacons={beacons} />}
              <SelectCellar />
              <BeaconPathTracker
                onPathFetched={setPath}
                onClearPath={() => setPath([])}
                tracking={path.length > 0}
              />

              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                <CellarAreaMap
                  addBoundingBox={addBoundingBox}
                  showBoundingBox={showBoundingBox}
                  path={path}
                />
              </TransformComponent>
            </div>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default Dashboard;

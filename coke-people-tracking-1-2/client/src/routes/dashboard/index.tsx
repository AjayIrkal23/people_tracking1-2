import { useContext } from "react";
import clsx from "clsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useAuth from "@/hooks/auth/useAuth";
import CellarAreaMap from "./components/CellarAreaMap";
import TransformControls from "./components/TransformControls";
import AddGatewayOnMap from "./components/AddGatewayOnMap";
import AddConnectPointOnMap from "./components/AddConnectPointOnMap";
import AddBoundingBoxOnMap from "./components/AddBoundingBoxOnMap";
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { ref, transformWrapperRef, enterFullscreen } = useFullscreen();
  const { scale, setScale, isFullScreen } = useContext(MapContext);
  const { addGateway, handleAddGateway, onAddGateway, setAddGateway } =
    useAddGateway();
  const {
    addConnectPoint,
    handleAddConnectPoint,
    onAddConnectPoint,
    setAddConnectPoint,
  } = useAddConnectPoint();
  const {
    addBoundingBox,
    setAddBoundingBox,
    onAddBoundingBox,
    handleAddBoundingBox,
    showBoundingBox,
    toggleShowBoundingBox,
  } = useAddBoundingBox();
  const { beacons, fetchConnectPoints, fetchGateways } =
    useContext(DeviceContext);

  usePolling(fetchConnectPoints, 3000);
  usePolling(fetchGateways, 3000);

  const handleMapClick = (event: React.MouseEvent) => {
    if (addGateway.active) handleAddGateway(event);
    else if (addConnectPoint.active) handleAddConnectPoint(event);
    else if (addBoundingBox.active) handleAddBoundingBox(event);
  };

  return (
    <div>
      {isAdmin && (
        <div className="flex gap-2 flex-row-reverse ">
          <AddBoundingBoxOnMap
            addBoundingBox={addBoundingBox}
            setAddBoundingBox={setAddBoundingBox}
            onAddBoundingBox={onAddBoundingBox}
          />
          <AddConnectPointOnMap
            addConnectPoint={addConnectPoint}
            onAddConnectPoint={onAddConnectPoint}
            setAddConnectPoint={setAddConnectPoint}
          />
          <AddGatewayOnMap
            addGateway={addGateway}
            onAddGateway={onAddGateway}
            setAddGateway={setAddGateway}
          />
        </div>
      )}
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

import { useContext, useState } from "react";
import { Button, Modal, Select } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { AddDeviceOnMapType } from "@/interfaces/device";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { handleApiError } from "@/helpers/handleApiError";
import useCalculateCanvasMeasures from "../hooks/useCalculateCanvasMeasures";
import * as yup from "yup";
import { getNormalizedCoordinates } from "@/helpers/getNormalizedCoordinates";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import DeviceContext from "@/context/DeviceContext";

const schema = yup
  .object({
    cpid: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface AddConnectPointOnMapProps {
  onAddConnectPoint: () => void;
  addConnectPoint: AddDeviceOnMapType;
  setAddConnectPoint: React.Dispatch<React.SetStateAction<AddDeviceOnMapType>>;
}

const AddConnectPointOnMap: React.FC<AddConnectPointOnMapProps> = ({
  onAddConnectPoint,
  addConnectPoint,
  setAddConnectPoint,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const canvasMeasures = useCalculateCanvasMeasures();
  const { connectPoints, fetchConnectPoints } = useContext(DeviceContext);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    setAddConnectPoint({ ...addConnectPoint, modalOpen: false });
    reset();
  };

  const generatePayload = (data: FormData) => {
    return {
      cpid: Number(data.cpid),
      normalizedX: getNormalizedCoordinates(
        "x-axis",
        addConnectPoint.clickX,
        canvasMeasures
      ),
      normalizedY: getNormalizedCoordinates(
        "y-axis",
        addConnectPoint.clickY,
        canvasMeasures
      ),
    };
  };

  const onSubmit = async (data: FormData) => {
    setConfirmLoading(true);
    try {
      const payload = generatePayload(data);
      await axiosPrivate.post("/connectPoint/addOnMap", payload);
      setAddConnectPoint({ ...addConnectPoint, modalOpen: false });
      fetchConnectPoints();
      reset();
    } catch (error) {
      handleApiError(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={onAddConnectPoint}
        className="my-4"
        icon={<PlusCircleFilled />}
      >
        Connect Point
      </Button>
      <Modal
        title="Enter Device Details"
        open={addConnectPoint.modalOpen}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="cpid"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                placeholder="Select a Connect Point"
              >
                {connectPoints
                  .filter((connectPoint) => !connectPoint.positionOnMap)
                  .map((connectPoint) => (
                    <Select.Option
                      key={connectPoint.cpid}
                      value={connectPoint.cpid}
                    >
                      {connectPoint.cpid}
                    </Select.Option>
                  ))}
              </Select>
            )}
          />

          {errors.cpid && (
            <span className="text-red-500">{errors.cpid.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default AddConnectPointOnMap;

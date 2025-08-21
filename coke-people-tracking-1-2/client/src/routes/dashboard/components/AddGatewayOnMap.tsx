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
    gwid: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface AddGatewayOnMapProps {
  onAddGateway: () => void;
  addGateway: AddDeviceOnMapType;
  setAddGateway: React.Dispatch<React.SetStateAction<AddDeviceOnMapType>>;
}

const AddGatewayOnMap: React.FC<AddGatewayOnMapProps> = ({
  onAddGateway,
  addGateway,
  setAddGateway,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const canvasMeasures = useCalculateCanvasMeasures();
  const { gateways, fetchGateways } = useContext(DeviceContext);
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
    setAddGateway({ ...addGateway, modalOpen: false });
    reset();
  };

  const generatePayload = (data: FormData) => {
    return {
      gwid: Number(data.gwid),
      normalizedX: getNormalizedCoordinates(
        "x-axis",
        addGateway.clickX,
        canvasMeasures
      ),
      normalizedY: getNormalizedCoordinates(
        "y-axis",
        addGateway.clickY,
        canvasMeasures
      ),
    };
  };

  const onSubmit = async (data: FormData) => {
    setConfirmLoading(true);
    try {
      const payload = generatePayload(data);
      await axiosPrivate.post("/gateway/addOnMap", payload);
      setAddGateway({ ...addGateway, modalOpen: false });
      fetchGateways();
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
        onClick={onAddGateway}
        className="my-4"
        icon={<PlusCircleFilled />}
      >
        Gateway
      </Button>
      <Modal
        title="Enter Device Details"
        open={addGateway.modalOpen}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="gwid"
            control={control}
            render={({ field }) => (
              <Select {...field} size="large" placeholder="Select a Gateway">
                {gateways
                  .filter((gateway) => !gateway.positionOnMap)
                  .map((gateway) => (
                    <Select.Option key={gateway.gwid} value={gateway.gwid}>
                      {gateway.gwid}
                    </Select.Option>
                  ))}
              </Select>
            )}
          />

          {errors.gwid && (
            <span className="text-red-500">{errors.gwid.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default AddGatewayOnMap;

import { useContext, useState } from "react";
import { Button, Modal, Select } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { BoundingBoxState } from "@/interfaces/device";
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

interface AddBoundingBoxOnMapProps {
  onAddBoundingBox: () => void;
  addBoundingBox: BoundingBoxState;
  setAddBoundingBox: React.Dispatch<React.SetStateAction<BoundingBoxState>>;
}

const AddBoundingBoxOnMap: React.FC<AddBoundingBoxOnMapProps> = ({
  onAddBoundingBox,
  addBoundingBox,
  setAddBoundingBox,
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
    setAddBoundingBox({ ...addBoundingBox, points: [], modalOpen: false });
    reset();
  };

  const generatePayload = (data: FormData) => {
    const normalizedPoints = addBoundingBox.points.map((point, index) =>
      getNormalizedCoordinates(
        index % 2 === 0 ? "x-axis" : "y-axis",
        point,
        canvasMeasures
      )
    );

    return {
      cpid: Number(data.cpid),
      roiPoints: normalizedPoints,
    };
  };

  const onSubmit = async (data: FormData) => {
    setConfirmLoading(true);
    try {
      const payload = generatePayload(data);
      await axiosPrivate.post("/connectPoint/roi/addOnMap", payload);
      setAddBoundingBox({ ...addBoundingBox, points: [], modalOpen: false });
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
        onClick={onAddBoundingBox}
        className="my-4"
        icon={<PlusCircleFilled />}
      >
        Bounding Box
      </Button>
      <Modal
        title="Enter Device Details"
        open={addBoundingBox.modalOpen}
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
                  .filter((connectPoint) => !connectPoint.boundingBoxOnMap)
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

export default AddBoundingBoxOnMap;

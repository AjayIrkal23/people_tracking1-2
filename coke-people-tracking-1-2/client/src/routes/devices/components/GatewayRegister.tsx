import React, { useState } from "react";
import { Button, Modal, Input, message, Select, Checkbox } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { PlusCircleFilled } from "@ant-design/icons";
import { handleApiError } from "@/helpers/handleApiError";
import useConnectPoint from "../../../hooks/useConnectPoint";

const schema = yup
  .object({
    gwid: yup.string().required("Please Enter Gateway ID"),
    side: yup.string().required("Please Select A Side"),
    location: yup.string().required("Please Select A Location"),
    connectPoints: yup
      .array()
      .of(yup.string())
      .required("Please select at least one Connect Point")
      .min(1, "Please select at least one Connect Point"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface RegisterGatewayProps {
  fetchGateways: () => void;
}

interface CPID {
  label: number;
  value: string;
}

const RegisterGateway: React.FC<RegisterGatewayProps> = ({ fetchGateways }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { connectPoints, fetchConnectPoints } = useConnectPoint();
  const axiosPrivate = useAxiosPrivate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  let checkboxOptions: CPID[] = [];

  connectPoints.map((connectPoint) => {
    if (!connectPoint.parentGateway) {
      checkboxOptions.push({
        label: connectPoint.cpid,
        value: connectPoint._id,
      });
    }
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    setConfirmLoading(true);
    try {
      console.log(data);
      const payload = { ...data, gwid: Number(data.gwid) };
      await axiosPrivate.post("/gateway/register", payload);
      message.success("Gateway registered successfully");
      fetchGateways();
      setOpen(false);
      reset();
      fetchConnectPoints();
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
        onClick={showModal}
        className="mt-4"
        icon={<PlusCircleFilled />}
      >
        Register Gateway
      </Button>
      <Modal
        title="Enter Gateway Details"
        open={open}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="gwid"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Gateway ID"
                type="number"
              />
            )}
          />
          {errors.gwid && (
            <span className="text-red-500">{errors.gwid.message}</span>
          )}

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select {...field} size="large" placeholder="Location">
                <Select.Option value="battery 5">Battery 5</Select.Option>
                <Select.Option value="battery 6">Battery 6</Select.Option>
              </Select>
            )}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}

          <Controller
            name="side"
            control={control}
            render={({ field }) => (
              <Select {...field} size="large" placeholder="Side">
                <Select.Option value="Coke Side">Coke Side</Select.Option>
                <Select.Option value="Pusher Side">Pusher Side</Select.Option>
              </Select>
            )}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}

          <div>
            <h4 className="mb-2 font-semibold text-gray-700">
              Assign Connect Points:
            </h4>
            <Controller
              name="connectPoints"
              control={control}
              render={({ field }) => (
                <Checkbox.Group {...field} options={checkboxOptions} />
              )}
            />
            {errors.connectPoints && (
              <span className="text-red-500">
                {errors.connectPoints.message}
              </span>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default RegisterGateway;

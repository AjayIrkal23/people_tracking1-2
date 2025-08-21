import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { PlusCircleFilled } from "@ant-design/icons";
import { handleApiError } from "@/helpers/handleApiError";

const schema = yup
  .object({
    cpid: yup.number().required("Please Enter Connect Point ID"),
    pillarStart: yup.number().required("Please Enter Starting Pillar Number"),
    pillarEnd: yup.number().required("Please Enter Ending Pillar Number"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface RegisterConnectPointProps {
  fetchConnectPoints: () => void;
}

const RegisterConnectPoint: React.FC<RegisterConnectPointProps> = ({
  fetchConnectPoints,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
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
      await axiosPrivate.post("/connectPoint/register", data);
      message.success("Connect Point registered successfully");
      fetchConnectPoints();
      setOpen(false);
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
        onClick={showModal}
        className="mt-4"
        icon={<PlusCircleFilled />}
      >
        Register Connect Point
      </Button>
      <Modal
        title="Enter Connect Point Details"
        open={open}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="cpid"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                type="number"
                placeholder="Connect Point ID"
              />
            )}
          />
          {errors.cpid && (
            <span className="text-red-500">{errors.cpid.message}</span>
          )}

          <Controller
            name="pillarStart"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                type="number"
                placeholder="Pillar Start"
              />
            )}
          />
          {errors.pillarStart && (
            <span className="text-red-500">{errors.pillarStart.message}</span>
          )}

          <Controller
            name="pillarEnd"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                type="number"
                placeholder="Pillar End"
              />
            )}
          />
          {errors.pillarEnd && (
            <span className="text-red-500">{errors.pillarEnd.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default RegisterConnectPoint;

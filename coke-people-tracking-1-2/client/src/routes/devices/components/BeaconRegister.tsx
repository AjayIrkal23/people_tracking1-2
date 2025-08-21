import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { PlusCircleFilled } from "@ant-design/icons";
import { handleApiError } from "@/helpers/handleApiError";

const schema = yup
  .object({
    bnid: yup.string().required("Please Enter Beacon ID"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface RegisterBeaconProps {
  fetchBeacons: () => void;
}

const RegisterBeacon: React.FC<RegisterBeaconProps> = ({ fetchBeacons }) => {
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
      const payload = { ...data, bnid: Number(data.bnid) };
      await axiosPrivate.post("/beacon/register", payload);
      fetchBeacons();
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
        Register Beacon
      </Button>
      <Modal
        title="Enter Beacon Details"
        open={open}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="bnid"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                size="large"
                placeholder="Beacon ID"
              />
            )}
          />
          {errors.bnid && (
            <span className="text-red-500">{errors.bnid.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default RegisterBeacon;

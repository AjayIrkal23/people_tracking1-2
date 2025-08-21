import React, { useState } from "react";
import { Button, Modal, Input, Select, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { PlusCircleFilled } from "@ant-design/icons";

const schema = yup
  .object({
    name: yup.string().required("Please Enter Full Name"),
    email: yup
      .string()
      .email("Email Must Be Valid")
      .required("Please Enter Email"),
    role: yup.string().required("Please Select a Role"),
    password: yup.string().required("Please Enter Password"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface RegisterUserProps {
  fetchUsers: () => void;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ fetchUsers }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
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
      await axiosPrivate.post("/user/register", data);
      message.success("User registered successfully");
      fetchUsers();
      setOpen(false);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        message.error(
          error.message || "An error occurred while registering the user"
        );
      } else {
        message.error("An unexpected error occurred");
      }
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
        Register User
      </Button>
      <Modal
        title="Enter User Details"
        open={open}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} size="large" placeholder="Full Name" />
            )}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} size="large" placeholder="Email" />
            )}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select {...field} size="large" placeholder="Role">
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="USER">USER</Select.Option>
              </Select>
            )}
          />
          {errors.role && (
            <span className="text-red-500">{errors.role.message}</span>
          )}

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="Password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            )}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default RegisterUser;

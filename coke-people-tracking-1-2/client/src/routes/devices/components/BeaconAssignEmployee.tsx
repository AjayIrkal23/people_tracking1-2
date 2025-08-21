import { useState } from "react";
import { Modal, Input } from "antd";
import { AssignEmployeeType } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    employeeName: yup.string().required("Please Enter Employee Name"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface AssignEmployeeToBeaconProps {
  fetchBeacons: () => void;
  assignEmployee: AssignEmployeeType;
  setAssignEmployee: React.Dispatch<React.SetStateAction<AssignEmployeeType>>;
}

const AssignEmployeeToBeacon: React.FC<AssignEmployeeToBeaconProps> = ({
  fetchBeacons,
  assignEmployee,
  setAssignEmployee,
}) => {
  const axiosPrivate = useAxiosPrivate();
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
    setAssignEmployee({ open: false, bnid: null });
  };

  const onSubmit = async (data: FormData) => {
    setConfirmLoading(true);

    try {
      let payload = { ...data, bnid: assignEmployee.bnid };
      await axiosPrivate.patch("/beacon/assignEmployee", payload);
      fetchBeacons();
      setAssignEmployee({ open: false, bnid: null });
      reset();
    } catch (error) {
      handleApiError(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Enter Beacon Details"
        open={assignEmployee.open}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="employeeName"
            control={control}
            render={({ field }) => (
              <Input {...field} size="large" placeholder="Employee Name" />
            )}
          />
          {errors.employeeName && (
            <span className="text-red-500">{errors.employeeName.message}</span>
          )}
        </form>
      </Modal>
    </>
  );
};

export default AssignEmployeeToBeacon;

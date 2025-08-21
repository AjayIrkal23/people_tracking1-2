import { Modal } from "antd";
import { DeleteConnectPointType } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";

interface DeleteConnectPointProps {
  fetchConnectPoints: () => void;
  deleteConnectPoint: DeleteConnectPointType;
  setDeleteConnectPoint: React.Dispatch<
    React.SetStateAction<DeleteConnectPointType>
  >;
}

const DeleteConnectPoint: React.FC<DeleteConnectPointProps> = ({
  fetchConnectPoints,
  deleteConnectPoint,
  setDeleteConnectPoint,
}) => {
  const axiosPrivate = useAxiosPrivate();

  const handleCancel = () => {
    setDeleteConnectPoint({ open: false, cpid: null });
  };

  const onConfirmDelete = async () => {
    try {
      await axiosPrivate.delete(
        `/connectPoint/delete/${deleteConnectPoint?.cpid}`
      );
      fetchConnectPoints();
      setDeleteConnectPoint({ open: false, cpid: null });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Modal
        title="Delete Device"
        open={deleteConnectPoint.open}
        onOk={onConfirmDelete}
        onCancel={handleCancel}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete Connect Point{" "}
          <b>{deleteConnectPoint?.cpid}</b>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default DeleteConnectPoint;

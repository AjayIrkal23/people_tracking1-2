import { Modal } from "antd";
import { DeleteGatewayType } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";

interface DeleteGatewayProps {
  fetchGateways: () => void;
  deleteGateway: DeleteGatewayType;
  setDeleteGateway: React.Dispatch<React.SetStateAction<DeleteGatewayType>>;
}

const DeleteGateway: React.FC<DeleteGatewayProps> = ({
  fetchGateways,
  deleteGateway,
  setDeleteGateway,
}) => {
  const axiosPrivate = useAxiosPrivate();

  const handleCancel = () => {
    setDeleteGateway({ open: false, gwid: null });
  };

  const onConfirmDelete = async () => {
    try {
      await axiosPrivate.delete(`/gateway/delete/${deleteGateway?.gwid}`);
      fetchGateways();
      setDeleteGateway({ open: false, gwid: null });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Modal
        title="Delete Device"
        open={deleteGateway.open}
        onOk={onConfirmDelete}
        onCancel={handleCancel}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete Gateway <b>{deleteGateway?.gwid}</b>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default DeleteGateway;

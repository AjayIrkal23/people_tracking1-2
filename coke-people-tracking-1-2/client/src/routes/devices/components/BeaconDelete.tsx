import { Modal } from "antd";
import { DeleteBeaconType } from "@/interfaces/device";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { handleApiError } from "@/helpers/handleApiError";

interface DeleteBeaconProps {
  fetchBeacons: () => void;
  deleteBeacon: DeleteBeaconType;
  setDeleteBeacon: React.Dispatch<React.SetStateAction<DeleteBeaconType>>;
}

const DeleteBeacon: React.FC<DeleteBeaconProps> = ({
  fetchBeacons,
  deleteBeacon,
  setDeleteBeacon,
}) => {
  const axiosPrivate = useAxiosPrivate();

  const handleCancel = () => {
    setDeleteBeacon({ open: false, bnid: null });
  };

  const onConfirmDelete = async () => {
    try {
      await axiosPrivate.delete(`/beacon/delete/${deleteBeacon?.bnid}`);
      fetchBeacons();
      setDeleteBeacon({ open: false, bnid: null });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Modal
        title="Delete Device"
        open={deleteBeacon.open}
        onOk={onConfirmDelete}
        onCancel={handleCancel}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete beacon <b>{deleteBeacon?.bnid}</b>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default DeleteBeacon;

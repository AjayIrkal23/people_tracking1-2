import { message } from "antd";
import axios from "axios";

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      error.response.data.errors.forEach((err: any) =>
        message.error(err.message)
      );
    } else {
      message.error(error.response?.data?.message || "An error occurred");
    }
  } else if (error instanceof Error) {
    message.error(error.message || "An unexpected error occurred");
  } else {
    message.error("An unexpected error occurred");
  }
};

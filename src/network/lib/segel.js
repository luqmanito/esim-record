import axiosClient from "@/network/axiosClient";

export default {
  pengaturanSegel({ id, description, value }) {
    return axiosClient.put(`pengaturan/edit/${id}`, {
      description,
      value,
    });
  },
};

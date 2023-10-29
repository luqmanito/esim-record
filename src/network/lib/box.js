import axiosClient from "@/network/axiosClient";

export default {
  getListDimensionBox({ limit = 10, offset = 0, search = "" }) {
    return axiosClient.get(
      `box/dimensi/list?limit=${limit}&offset=${offset}&search=${search}`
    );
  },
  getDimensionBoxById({ id }) {
    return axiosClient.get(`box/dimensi/row/${id}`);
  },
  createDimensionBox({ box, deskripsi }) {
    return axiosClient.post("box/dimensi/create", {
      box,
      deskripsi,
    });
  },
  editDimensionBox({ id, box, deskripsi }) {
    return axiosClient.put(`box/dimensi/edit/${id}`, {
      box,
      deskripsi,
    });
  },
  deleteDimensionBox({ id }) {
    return axiosClient.delete(`box/dimensi/remove/${id}`);
  },

  //   List Box
  getListBox({ limit = 10, offset = 0, search = "" }) {
    return axiosClient.get(
      `box/list?limit=${limit}&offset=${offset}&search=${search}`
    );
  },
  getBoxById({ id }) {
    return axiosClient.get(`box/row/${id}`);
  },
  createBox({ dimensi_box_id, qty }) {
    return axiosClient.post("box/create", {
      dimensi_box_id,
      qty,
    });
  },
  editBox({ id, serial_number, dimensi_box_id, status }) {
    return axiosClient.put(`box/edit/${id}`, {
      serial_number,
      dimensi_box_id,
      status,
    });
  },
  deleteBox({ id }) {
    return axiosClient.delete(`box/remove/${id}`);
  },
};

import axiosClient from "@/network/axiosClient";

export default {
  getListRFID({
    limit = 10,
    offset = 0,
    search = "",
    order = "DESC",
    order_key = "created_at",
  }) {
    return axiosClient.get(
      `rfid/list?limit=${limit}&offset=${offset}&search=${search}&order=${order}&order_key=${order_key}`
    );
  },
  getSummaryRFID({}) {
    return axiosClient.get(`rfid/summary`);
  },
  getRFIDById({ id }) {
    return axiosClient.get(`rfid/row/${id}`);
  },
  createRFID({ rfid, gudang_id, status }) {
    return axiosClient.post("rfid/create", {
      rfid,
      gudang_id,
      status,
    });
  },
  editRFID({ id, rfid, gudang_id, status }) {
    return axiosClient.put(`rfid/edit/${id}`, {
      rfid,
      gudang_id,
      status,
    });
  },
  deleteRFID({ id }) {
    return axiosClient.delete(`rfid/remove/${id}`);
  },
};

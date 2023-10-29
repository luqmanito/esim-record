import axiosClient from "@/network/axiosClient";

export default {
  getListKodeKlasifikasi({
    limit = 10,
    offset = 0,
    search = "",
    order = "DESC",
    order_key = "created_at",
  }) {
    return axiosClient.get(
      `kode-klasifikasi/list?limit=${limit}&offset=${offset}&search=${search}&order=${order}&order_key=${order_key}`
    );
  },
  getKodeKlasifikasiById({ id }) {
    return axiosClient.get(`kode-klasifikasi/row/${id}`);
  },
  createKodeKlasifikasi({ klasifikasi, status }) {
    return axiosClient.post("kode-klasifikasi/create", {
      klasifikasi,
      status,
    });
  },
  editKodeKlasifikasi({ id, klasifikasi, status }) {
    return axiosClient.put(`kode-klasifikasi/edit/${id}`, {
      klasifikasi,
      status,
    });
  },
  deleteKodeKlasifikasi({ id }) {
    return axiosClient.delete(`kode-klasifikasi/remove/${id}`);
  },
};

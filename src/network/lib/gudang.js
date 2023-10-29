import axiosClient from "@/network/axiosClient";

export default {
  getListGudang({
    limit = 10,
    offset = 0,
    search = "",
    order = "DESC",
    order_key = "created_at",
  }) {
    return axiosClient.get(
      `gudang/list?limit=${limit}&offset=${offset}&search=${search}&order=${order}&order_key=${order_key}`
    );
  },

  getGudangById({ id }) {
    return axiosClient.get(`gudang/row/${id}`);
  },

  createGudang({ kode, gudang, alamat, no_tlp, status }) {
    return axiosClient.post("gudang/create", {
      kode,
      gudang,
      alamat,
      no_tlp,
      status,
    });
  },

  editGudang({ id, kode, gudang, alamat, no_tlp, status }) {
    return axiosClient.put(`gudang/edit/${id}`, {
      kode,
      gudang,
      alamat,
      no_tlp,
      status,
    });
  },

  deleteGudang({ id }) {
    return axiosClient.delete(`gudang/remove/${id}`);
  },

  getListHistoryGudang({ limit = 10, offset = 0, from, to, created_by }) {
    return axiosClient.get(
      `history-activity/list?module=gudang&limit=${limit}&offset=${offset}${
        from ? `&from=${from}` : ""
      }${to ? `&to=${to}` : ""}${created_by ? `&created_by=${created_by}` : ""}`
    );
  },
};

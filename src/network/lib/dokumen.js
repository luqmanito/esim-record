import axiosClient from "@/network/axiosClient";

export default {
  getListDokumen({
    limit = 10,
    offset = 0,
    search = "",
    layanan,
    role,
    order = "DESC",
    order_key = "created_at",
  }) {
    return axiosClient.get(
      `dokumen/list?limit=${limit}&offset=${offset}&search=${search}&layanan=${layanan}&role=${role}&order=${order}&order_key=${order_key}`
    );
  },

  getDokumenById({ id }) {
    return axiosClient.get(`dokumen/row/${id}`);
  },

  createDokumen({ document, type, orders, layanan, status }) {
    return axiosClient.post("dokumen/create", {
      document,
      type,
      orders,
      layanan,
      status,
    });
  },

  editDokumen({ id, document, type, orders, layanan, status }) {
    return axiosClient.put(`dokumen/edit/${id}`, {
      document,
      type,
      orders,
      layanan,
      status,
    });
  },

  deleteDokumen({ id }) {
    return axiosClient.delete(`dokumen/remove/${id}`);
  },

  getListHistoryDokumen({ limit = 10, offset = 0, from, to, created_by }) {
    return axiosClient.get(
      `history-activity/list?module=dokumen&limit=${limit}&offset=${offset}${
        from ? `&from=${from}` : ""
      }${to ? `&to=${to}` : ""}${created_by ? `&created_by=${created_by}` : ""}`
    );
  },
};

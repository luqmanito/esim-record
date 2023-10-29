import axiosClient from "@/network/axiosClient";

export default {
  getListHistoryActivity({
    module = "dokumen",
    limit = 10,
    offset = 0,
    from,
    to,
    created_by,
    id,
    pk,
  }) {
    return axiosClient.get(
      `history-activity/list?module=${module}&limit=${limit}&offset=${offset}${
        from ? `&from=${from}` : ""
      }${to ? `&to=${to}` : ""}${
        created_by ? `&created_by=${created_by}` : ""
      }${id ? `&id=${id}` : ""}${pk ? `&pk=${pk}` : ""}`
    );
  },

  getHistoryActivityById() {
    return axiosClient.get(`history-activity/row/${id}`);
  },
};

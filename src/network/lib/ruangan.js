import axiosClient from "@/network/axiosClient";

export default {
  getListRuangan({
    limit = 10,
    offset = 0,
    search = "",
    gudang_id = "",
    layanan_id = "",
  }) {
    return axiosClient.get(
      `ruang/list?limit=${limit}&offset=${offset}&search=${search}${
        gudang_id ? `&gudang_id=${gudang_id}` : ""
      }${layanan_id ? `&layanan_id=${layanan_id}` : ""}`
    );
  },
  getRuanganById({ id }) {
    return axiosClient.get(`ruang/row/${id}`);
  },
  createRuangan({
    ruangan,
    gudang_id,
    layanan_id,
    row_capacity,
    column_capacity,
    status,
  }) {
    return axiosClient.post("ruang/create", {
      ruangan,
      gudang_id,
      layanan_id,
      row_capacity,
      column_capacity,
      status,
    });
  },
  editRuangan({
    id,
    ruangan,
    gudang_id,
    layanan_id,
    change_row_and_capacity,
    row_capacity,
    column_capacity,
    status,
  }) {
    return axiosClient.put(`ruang/edit/${id}`, {
      ruangan,
      gudang_id,
      layanan_id,
      change_row_and_capacity,
      row_capacity,
      column_capacity,
      status,
    });
  },
  deleteRuangan({ id }) {
    return axiosClient.delete(`ruang/remove/${id}`);
  },

  getRuanganDetailList({ id }) {
    return axiosClient.get(`ruang/detail/list/${id}`);
  },

  getRuanganDetailById({ id }) {
    return axiosClient.get(`ruang/detail/row/${id}`);
  },

  // Get Space / Area by Ruangan
  getSpaceByRuanganId({ ruangan_id }) {
    return axiosClient.get(`ruang/${ruangan_id}/space`);
  },

  // Prefix
  getRuanganPrefixById({ id }) {
    return axiosClient.get(`ruang/${id}/prefix`);
  },

  createRuanganPrefixById({ id, data }) {
    return axiosClient.post(`ruang/${id}/prefix`, data);
  },
};

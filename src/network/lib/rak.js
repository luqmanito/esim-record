import axiosClient from "@/network/axiosClient";

export default {
  getListRak({ limit = 10, offset = 0, search = "" }) {
    return axiosClient.get(
      `rak/list?limit=${limit}&offset=${offset}&search=${search}`
    );
  },
  getRakById({ id }) {
    return axiosClient.get(`rak/row/${id}`);
  },
  createRak({ rak, ruang_detail_id, box_id, panjang, tinggi, lebar }) {
    return axiosClient.post("rak/create", {
      rak,
      ruang_detail_id,
      box_id,
      panjang,
      tinggi,
      lebar,
    });
  },
  editRak({ id, rak, ruang_detail_id, box_id, panjang, tinggi, lebar }) {
    return axiosClient.put(`rak/edit/${id}`, {
      rak,
      ruang_detail_id,
      box_id,
      panjang,
      tinggi,
      lebar,
    });
  },
  deleteRak({ id }) {
    return axiosClient.delete(`rak/remove/${id}`);
  },

  // Get Rak by Space / Area ID
  getRakBySpaceId({ ruangan_id, space_id }) {
    return axiosClient.get(`/ruang/${ruangan_id}/space/${space_id}`);
  },

  // Get View Rak by Space / Area ID
  getViewSideRakBySpaceId({ ruangan_id, space_id, lebar }) {
    return axiosClient.get(
      `/ruang/${ruangan_id}/space/${space_id}/lebar/${lebar}`
    );
  },
};

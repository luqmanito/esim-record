import axiosClient from "@/network/axiosClient";

export default {
  getListHakAkses({ role_type, role_id }) {
    return axiosClient.get(
      `menu/list-by-role-type?role_type=${role_type}&role_id=${role_id}`
    );
  },
  getHakAksesById({ id }) {
    return axiosClient.get(`menu/row/${id}`);
  },
  setAksesByRole({ role_id, access }) {
    return axiosClient.post("menu/set-access-by-role", {
      role_id,
      access,
    });
  },
};

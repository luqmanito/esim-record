import axiosClient from "@/network/axiosClient";

export default {
  getListRoles({
    limit = 10,
    offset = 0,
    search = "",
    paging = 1,
    roletype = "",
  }) {
    return axiosClient.get(
      `roles/list?limit=${limit}&offset=${offset}&search=${search}&paging=${paging}${
        roletype ? `&roletype=${roletype}` : ""
      }`
    );
  },
  getRolesById({ id }) {
    return axiosClient.get(`roles/row/${id}`);
  },
  createRoles({ role, role_type, master, status }) {
    return axiosClient.post("roles/create", {
      role,
      role_type,
      master,
      status,
    });
  },
  editRoles({ id, role, role_type, master, status }) {
    return axiosClient.put(`roles/edit/${id}`, {
      id,
      role,
      role_type,
      master,
      status,
    });
  },

  deleteRoles({ id }) {
    return axiosClient.delete(`roles/remove/${id}`);
  },

  getListRoleType() {
    return axiosClient.get(`roles-type/list`);
  },

  getListAllRoles() {
    return axiosClient.get("roles/list");
  },
};

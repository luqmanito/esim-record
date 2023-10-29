import axiosClient from "@/network/axiosClient";

export default {
  getListMenu({}) {
    return axiosClient.get("menu/list");
  },
  getMenuById({ id }) {
    return axiosClient.get(`menu/row/${id}`);
  },
  createMenu({
    title,
    menu_key,
    url,
    icon,
    type,
    urutan,
    parent_id,
    role_type,
  }) {
    return axiosClient.post("menu/create", {
      title,
      menu_key,
      url,
      icon,
      type,
      urutan,
      parent_id,
      role_type,
    });
  },
  editMenu({
    id,
    title,
    menu_key,
    url,
    icon,
    type,
    urutan,
    parent_id,
    role_type,
  }) {
    return axiosClient.put(`menu/edit/${id}`, {
      id,
      title,
      menu_key,
      url,
      icon,
      type,
      urutan,
      parent_id,
      role_type,
    });
  },

  deleteMenu({ id }) {
    return axiosClient.delete(`menu/remove/${id}`);
  },
};

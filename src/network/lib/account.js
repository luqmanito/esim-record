import axiosClient from "@/network/axiosClient";

export default {
  getMyAccount() {
    return axiosClient.get("account/me");
  },
  getMenuAkses() {
    return axiosClient.get("account/menu-access");
  },
  getAccountById({ id }) {
    return axiosClient.get(`account/id/${id}`);
  },
  editAccount({ data }) {
    return axiosClient("account/edit", {
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  changePassword({ old_password, password, password_confirmation }) {
    return axiosClient.put("account/security/change-password", {
      old_password,
      password,
      password_confirmation,
    });
  },
};

import axiosClient from "@/network/axiosClient";

export default {
  getListUsers({ limit = 10, offset = 0, search = "", role_id }) {
    return axiosClient.get(
      `users/list?limit=${limit}&offset=${offset}&search=${search}${
        role_id ? `&role_id=${role_id}` : ""
      }`
    );
  },

  getUsersById({ id }) {
    return axiosClient.get(`users/row/${id}`);
  },

  inviteUsers({ email, roles }) {
    return axiosClient.post("users/invite", {
      email,
      roles,
    });
  },
  createUsers({ name, email, roles }) {
    return axiosClient.post("users/create", {
      name,
      email,
      roles,
    });
  },
  editUsers({ id, username, name, email, roles, status, invitation }) {
    return axiosClient.put(`users/edit/${id}`, {
      username,
      name,
      email,
      roles,
      status,
      invitation,
    });
  },
  deleteUsers({ id }) {
    return axiosClient.delete(`users/remove/${id}`);
  },

  resendVerifyUsers({ id, name, email, roles }) {
    return axiosClient.put(`users/invite/resend/${id}`, {
      name,
      email,
      roles,
    });
  },

  verifyEmailAccount({ token }) {
    return axiosClient.get(`account/verify?token=${token}`);
  },

  confirmVerifyEmailAccount({ token }) {
    return axiosClient.put(`account/verify?token=${token}`);
  },
};

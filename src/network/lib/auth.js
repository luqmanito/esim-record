import axiosClient from "@/network/axiosClient";

export default {
  login({ username, password }) {
    return axiosClient.post("internal/auth/login", { username, password });
  },

  register({ id, name, email, password, password_confirmation }) {
    return axiosClient.post("internal/auth/register", {
      id,
      name,
      email,
      password,
      password_confirmation,
    });
  },

  forgotPassword({ email }) {
    return axiosClient.post("auth/forgot-password", {
      email,
    });
  },

  validateForgotPassword({ token }) {
    return axiosClient.get(`auth/validate-forgot-password?token=${token}`);
  },

  validateKodeForgotPassword({ kode, token }) {
    return axiosClient.post(`auth/validate-kode-forgot-password`, {
      kode,
      token,
    });
  },

  resetForgotPassword({ kode, token, password, password_confirmation }) {
    return axiosClient.post(`auth/reset-password`, {
      kode,
      token,
      password,
      password_confirmation,
    });
  },
};

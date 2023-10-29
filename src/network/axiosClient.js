import axios from "axios";

import { getCookies } from "@/utils/cookies";

import store from "@/store";

import router from "@/router";

const HOST = import.meta.env.VITE_HOST;

const APP_ID = import.meta.env.VITE_APP_ID;

const axiosClient = axios.create({
  baseURL: HOST,
  timeout: 30000,
  headers: {
    "APP-ID": APP_ID,
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookies("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    console.error("ERROR", error);
    /*
    Auto Refresh Token Example
    const originalConfig = error.config;

    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      const refreshToken = getCookies("refresh_token");

      if (refreshToken) {
        const response = await store.dispatch("auth/refreshToken", {
          token: refreshToken,
        });
        if (response.data && response.status === 200) {
          const accessToken = response.data.token;
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;

          return axiosClient(originalConfig);
        }
      }
    }

    */

    const messageTokenExpired = "This token has expired.";

    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message == messageTokenExpired
    ) {
      store.dispatch("auth/logout");
      store.dispatch("auth/showToastError", {
        title: "Akses Token Kadaluarsa",
        icon: "AlertTriangleIcon",
        text: "Silahkan Login untuk melanjutkan kembali",
        variant: "danger",
      });

      router.push("/auth/login");
    } else if (error?.response?.status == 503) {
      store.dispatch("auth/showToastError", {
        title: "Aplikasi Sedang Maintenance",
        icon: "AlertTriangleIcon",
        text:
          error?.response?.data?.message ||
          "Sistem kami sedang maintenance harap bersabar",
        variant: "danger",
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

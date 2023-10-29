import AuthNetwork from "@/network/lib/auth";
import AccountNetwork from "@/network/lib/account";

import ToastificationContent from "@/components/Toastification/ToastificationContent.vue";

import { getCookies, removeAllCookies, setCookies } from "@/utils/cookies";

export default {
  namespaced: true,
  state: {
    account: null,
    access: [],
    menu: [],
    functions: [],
    isAuthenticated: false,
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    account(state) {
      return state.account;
    },
    access(state) {
      return state.access;
    },
    menu(state) {
      return state.menu;
    },
    functions(state) {
      return state.functions;
    },
  },
  mutations: {
    SET_AUTHENTICATED(state, payload) {
      state.isAuthenticated = payload;
    },
    SET_ACCOUNT(state, payload) {
      state.account = payload;
    },
    SET_ACCESS(state, payload) {
      state.access = payload;
    },
    SET_MENU(state, payload) {
      state.menu = payload;
    },
    SET_FUNCTIONS(state, payload) {
      state.functions = payload;
    },
  },
  actions: {
    async getTokenFromCache({ commit, dispatch }) {
      const token = getCookies("token");
      if (token) {
        commit("SET_AUTHENTICATED", true);
      } else {
        removeAllCookies();
        dispatch("removeAllState");
      }
    },

    async getMyAccount({ commit }) {
      try {
        const response = await AccountNetwork.getMyAccount();
        if (response) {
          commit("SET_ACCOUNT", response?.data);
        }
      } catch (error) {
        removeAllCookies();
        dispatch("removeAllState");
      }
    },

    async login({ commit, dispatch }, payload) {
      try {
        const response = await AuthNetwork.login(payload);

        if (response) {
          const token = response?.data?.token;
          const account = response?.data?.account;
          const access = response?.data?.account?.access;
          const menu = response?.data?.menu;

          await setCookies({
            token: token,
          });

          commit("SET_ACCOUNT", account);
          commit("SET_ACCESS", access);
          commit("SET_MENU", menu);

          commit("SET_AUTHENTICATED", true);

          return response;
        }
      } catch (error) {
        removeAllCookies();
        dispatch("removeAllState");

        if (error.response && error.response.status != 404) {
          this._vm.$toast.error({
            component: ToastificationContent,
            props: {
              title: "Login Gagal",
              icon: "AlertTriangleIcon",
              text: error?.response?.data?.message,
              variant: "danger",
            },
          });
          throw error.response;
        } else {
          this._vm.$toast.error({
            component: ToastificationContent,
            props: {
              title: "Login Gagal",
              icon: "AlertTriangleIcon",
              text: "Oops.. Terjadi kesalahan pada sistem kami",
              variant: "danger",
            },
          });
          throw error;
        }
      }
    },

    async getMenu({ commit, dispatch }) {
      try {
        const response = await AccountNetwork.getMenuAkses();

        if (response) {
          const menu = response?.data?.menu;
          const functions = response?.data?.functions;
          const access = response?.data?.access;

          commit("SET_MENU", menu);
          commit("SET_FUNCTIONS", functions);
          commit("SET_ACCESS", access);

          return response;
        }
      } catch (error) {
        removeAllCookies();
        dispatch("removeAllState");

        if (error.response && error.response.status != 404) {
          this._vm.$toast.error({
            component: ToastificationContent,
            props: {
              title: "Login Gagal",
              icon: "AlertTriangleIcon",
              text: error?.response?.data?.message,
              variant: "danger",
            },
          });
          throw error.response;
        } else {
          this._vm.$toast.error({
            component: ToastificationContent,
            props: {
              title: "Login Gagal",
              icon: "AlertTriangleIcon",
              text: "Oops.. Terjadi kesalahan pada sistem kami",
              variant: "danger",
            },
          });
          throw error;
        }
      }
    },

    logout({ dispatch }) {
      removeAllCookies();
      dispatch("removeAllState");
    },

    removeAllState({ commit }) {
      /* Reset Manual
      commit("SET_ACCOUNT", null);
      commit("SET_ACCESS", []);
      commit("SET_MENU", []);
      commit("SET_FUNCTIONS", []);
      commit("SET_AUTHENTICATED", false);
      */

      commit("reset", null, { root: true });
    },

    setMyAccount({ commit }, payload) {
      commit("SET_ACCOUNT", payload);
    },

    showToastError({}, payload) {
      this._vm.$toast.error({
        component: ToastificationContent,
        props: {
          title: payload.title,
          icon: payload.icon || "AlertTriangleIcon",
          text: payload.text,
          variant: payload.variant || "danger",
        },
      });
    },
  },
};

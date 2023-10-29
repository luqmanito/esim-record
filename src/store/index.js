import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

// Initial Modules
import auth from "./modules/auth";
import app from "./modules/app";
import appConfig from "./modules/appConfig";
import verticalMenu from "./modules/verticalMenu";
import toast from "./modules/toast";

// Features Modules
import ruangan from "@/views/ruangan/ruanganModules";
import pengajuanPenyimpanan from "@/views/pengajuan-penyimpanan/pengajuanPenyimpananModule";

Vue.use(Vuex);

// initial state
let initialState = {
  auth: auth.state,
  app: app.state,
  appConfig: appConfig.state,
  verticalMenu: verticalMenu.state,
  toast: toast.state,

  ruangan: ruangan.state,
};

/* Example Persist Seleced State but Not Working
const vuexAccountLocalStorage = new VuexPersist({
  key: "account",
  storage: window.localStorage,
  reducer: (state) => ({
    account: state.auth.account,
  }),
});

const vuexAccessLocalStorage = new VuexPersist({
  key: "access",
  storage: window.localStorage,
  reducer: (state) => ({
    access: state.auth.access,
  }),
});

const vuexMenuLocalStorage = new VuexPersist({
  key: "menu",
  storage: window.localStorage,
  reducer: (state) => ({
    menu: state.auth.menu,
  }),
});


const vuexAppConfigLocalStorage = new VuexPersist({
  key: "appConfig",
  storage: window.localStorage,
  reducer: (state) => ({
    app: state.appConfig.app,
    layout: state.appConfig.layout,
  }),
});
*/

const vuexLocalStorage = new VuexPersist({
  key: "sim_record",
  storage: window.localStorage,
});

export default new Vuex.Store({
  modules: {
    auth,
    app,
    appConfig,
    verticalMenu,
    toast,

    ruangan,
    pengajuanPenyimpanan,
  },
  mutations: {
    reset(state) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key], initialState[key]);
      });
    },
  },
  plugins: [vuexLocalStorage.plugin],
});

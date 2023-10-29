import PengajuanPenyimpananNetwork from "@/network/lib/pengajuan-penyimpanan";

export default {
  namespaced: true,
  state: {
    detail: {},
    listStep: [],
    currentStep: {},
    fjb: {
      savedBox: [],
    },
    ktk: {
      syncedContract: {},
    },
    piv: {
      syncedTransaction: {},
    },
  },
  getters: {
    getDetail(state) {
      return state.detail;
    },
    getListStep(state) {
      return state.listStep;
    },
    getCurrentStep(state) {
      return state.currentStep;
    },
    getFJBSavedBox(state) {
      return state.fjb.savedBox;
    },
    getKTKSyncedContract(state) {
      return state.ktk.syncedContract;
    },
    getPIVSyncedTransaction(state) {
      return state.piv.syncedTransaction;
    },
  },
  mutations: {
    SET_DETAIL(state, payload) {
      state.detail = payload;
    },
    SET_LIST_STEP(state, payload) {
      state.listStep = payload;
    },
    SET_CURRENT_STEP(state, payload) {
      state.currentStep = payload;
    },
    SET_FJB_SAVED_BOX(state, payload) {
      state.fjb.savedBox = payload;
    },
    SET_KTK_SYNCED_CONTRACT(state, payload) {
      state.ktk.syncedContract = payload;
    },
    SET_PIV_SYNCED_TRANSACTION(state, payload) {
      state.piv.syncedTransaction = payload;
    },
  },
  actions: {
    async getDetailPengajuanPenyimpanan({ commit, dispatch }, payload) {
      try {
        const response =
          await PengajuanPenyimpananNetwork.getPengajuanPenyimpananById({
            id: payload.id,
          });

        if (response) {
          const data = response?.data;

          commit("SET_DETAIL", data);
          commit("SET_LIST_STEP", data?.progress);

          return response;
        }
      } catch (error) {
        dispatch("toast/showToastError", { error: error }, { root: true });
      }
    },

    async saveFormPengajuanMinat({ dispatch, commit, state }, payload) {
      try {
        const response =
          await PengajuanPenyimpananNetwork.saveFormPengajuanMinat({
            id: payload.id,
          });

        if (response) {
          dispatch(
            "toast/showToastSuccess",
            {
              title: "Form Minat Pelanggan",
              text: "Berhasil Menyimpan Data Form Minat Pelanggan",
            },
            { root: true }
          );

          dispatch("getDetailPengajuanPenyimpanan", { id: payload.id });

          commit("SET_CURRENT_STEP", {
            ...state.currentStep,
            penyimpananflow: {
              ...state.currentStep.penyimpananflow,
              status: "done",
            },
          });

          return response;
        }
      } catch (error) {
        dispatch("toast/showToastError", { error: error }, { root: true });
      }
    },

    async savePerhitunganBox({ dispatch, commit, state }, payload) {
      try {
        const response = await PengajuanPenyimpananNetwork.savePerhitunganBox({
          id: payload.id,
          box: payload.box,
        });

        if (response) {
          dispatch(
            "toast/showToastSuccess",
            {
              title: "Perhitungan Box",
              text: "Berhasil Menyimpan Data Perhitungan Box",
            },
            { root: true }
          );

          dispatch("getDetailPengajuanPenyimpanan", { id: payload.id });

          commit("SET_CURRENT_STEP", {
            ...state.currentStep,
            penyimpananflow: {
              ...state.currentStep.penyimpananflow,
              status: "done",
            },
          });

          return response;
        }
      } catch (error) {
        dispatch("toast/showToastError", { error: error }, { root: true });
      }
    },

    async saveLOCKontrak({ dispatch, commit, state }, payload) {
      try {
        const response = await PengajuanPenyimpananNetwork.saveLOCKontrak({
          id: payload.id,
          pelanggan_id: payload.pelanggan_id,
          contract_number: payload.contract_number,
        });

        if (response) {
          dispatch(
            "toast/showToastSuccess",
            {
              title: "LOC Kontrak",
              text: "Berhasil Menyimpan Data LOC Kontrak",
            },
            { root: true }
          );

          dispatch("getDetailPengajuanPenyimpanan", { id: payload.id });

          commit("SET_KTK_SYNCED_CONTRACT", {
            ...state.ktk.syncedContract,
            UpdatedAtDate: new Date().toISOString(),
          });

          commit("SET_CURRENT_STEP", {
            ...state.currentStep,
            penyimpananflow: {
              ...state.currentStep.penyimpananflow,
              status: "done",
            },
          });

          return response;
        }
      } catch (error) {
        dispatch("toast/showToastError", { error: error }, { root: true });
      }
    },

    async saveDraftInvoice({ dispatch, commit, state }, payload) {
      try {
        const response = await PengajuanPenyimpananNetwork.saveDraftInvoice({
          id: payload.id,
          invoice_number: payload.invoice_number,
          customer_transaction_id: payload.customer_transaction_id,
        });

        if (response) {
          dispatch(
            "toast/showToastSuccess",
            {
              title: "Draft Invoice",
              text: "Berhasil Menyimpan Data Draft Invoice",
            },
            { root: true }
          );

          dispatch("getDetailPengajuanPenyimpanan", { id: payload.id });

          commit("SET_PIV_SYNCED_TRANSACTION", {
            ...state.piv.syncedTransaction,
            UpdatedAtDate: new Date().toISOString(),
          });

          commit("SET_CURRENT_STEP", {
            ...state.currentStep,
            penyimpananflow: {
              ...state.currentStep.penyimpananflow,
              status: "done",
            },
          });

          return response;
        }
      } catch (error) {
        dispatch("toast/showToastError", { error: error }, { root: true });
      }
    },

    clearState({ commit }) {
      commit("SET_DETAIL", {});
      commit("SET_LIST_STEP", []);
      commit("SET_CURRENT_STEP", {});
      commit("SET_FJB_SAVED_BOX", []);
      commit("SET_KTK_SYNCED_CONTRACT", {});
      commit("SET_PIV_SYNCED_TRANSACTION", {});
    },
  },
};

export default {
  namespaced: true,
  state: {
    selectedSpace: [],
    selectedSpacePrefix: [],
    currentDataModalPrefix: {},
    savedDataModalPrefix: [],
  },
  getters: {
    getSelectedSpace(state) {
      return state.selectedSpace;
    },
    getSelectedSpacePrefix(state) {
      return state.selectedSpacePrefix;
    },
    getCurrentDataModalPrefix(state) {
      return state.currentDataModalPrefix;
    },
    getSavedDataModalPrefix(state) {
      return state.savedDataModalPrefix;
    },
  },
  mutations: {
    SET_SELECTED_SPACE(state, payload) {
      state.selectedSpace = payload;
    },
    SET_SELECTED_SPACE_PREFIX(state, payload) {
      state.selectedSpacePrefix = payload;
    },
    SET_CURRENT_DATA_MODAL_PREFIX(state, payload) {
      state.currentDataModalPrefix = payload;
    },
    SET_SAVED_DATA_MODAL_PREFIX(state, payload) {
      state.savedDataModalPrefix = payload;
    },
  },
};

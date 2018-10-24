import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    login: false,
    user: null,
    entries: null
  },
  mutations: {
    toggleLoading: (state, payload) => {
      state.loading = payload;
    },
    login: (state, payload) => {
      state.login = true;
      state.user = payload.user;
      state.entries = payload.entries;
    },
    logout: state => {
      state.login = false;
      state.user = null;
      state.entries = null;
    }
  },
  actions: {}
});

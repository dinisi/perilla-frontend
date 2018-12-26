import Vue from 'vue'
import Vuex from 'vuex'
import { parseJwt } from '@/utils'
import createPersistedState from 'vuex-persistedstate'
import { showToast } from './swal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    token: null,
    user: null,
    entry: null,
    adminMode: false
  },
  mutations: {
    toggleAdmin: (state, payload) => {
      state.adminMode = payload
    },
    toggleLoading: (state, payload) => {
      state.loading = payload
    },
    login: (state, payload) => {
      state.token = payload
      state.user = parseJwt(payload)._id
      state.entry = state.user
      showToast('success', 'welcome', state.user)
    },
    logout: state => {
      state.token = state.user = state.entry = null
    },
    changeEntry: (state, payload) => {
      state.entry = payload
    }
  },
  actions: {},
  plugins: [createPersistedState()]
})

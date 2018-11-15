import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    login: false,
    entries: null,
    user: null,
    entry: null,
    message: null,
    timestamp: null
  },
  mutations: {
    toggleLoading: (state, payload) => {
      state.loading = payload
    },
    login: (state, payload) => {
      state.login = true
      state.entries = payload.entries
      state.user = payload.user
      state.entry = payload.entries[0]
    },
    logout: state => {
      state.login = false
      state.user = null
      state.entries = null
    },
    changeEntry: (state, payload) => {
      state.entry = payload
    },
    updateMessage: (state, val) => {
      state.message = val
      state.timestamp = +new Date()
    }
  },
  actions: {}
})

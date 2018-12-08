import Vue from 'vue'
import Vuex from 'vuex'
import { setStorage } from './storage'
import { parseJwt } from './utils'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    token: null,
    user: null,
    entry: null,
    message: null,
    timestamp: 0
  },
  mutations: {
    toggleLoading: (state, payload) => {
      state.loading = payload
    },
    login: (state, payload) => {
      state.token = payload
      state.user = parseJwt(payload)._id
      state.entry = state.user
    },
    logout: state => {
      state.token = state.user = state.entry = null
    },
    changeEntry: (state, payload) => {
      state.entry = payload
      setStorage(sessionStorage, 'entry', payload)
    },
    updateMessage: (state, val) => {
      console.log(val)
      state.message = val
      state.timestamp++
    }
  },
  actions: {},
  plugins: [createPersistedState()]
})

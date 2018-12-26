import Axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'

export const client = Axios.create({})

export const request = async (config: AxiosRequestConfig) => {
  try {
    if (store.state.token) {
      config.headers = config.headers || {}
      config.headers['x-access-token'] = store.state.token
    }
    if (store.state.adminMode) {
      config.params = config.params || {}
      config.params.forced = true
    }
    const response = await client(config)
    if (response.data.status !== 'success') {
      const errorMsg = typeof response.data.payload === 'string' ? response.data.payload : 'Failed'
      if (response.data.payload === 'jwt expired') {
        // force logout user
        store.commit('logout')
      }
      throw new Error(errorMsg)
    } else {
      return response.data.payload
    }
  } catch (e) {
    throw e
  }
}

import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import store from '@/store'

export const client = Axios.create({})

export const request = async (config: AxiosRequestConfig) => {
  try {
    hookRequest(config)
    const response = await client(config)
    if (response.data.status !== 'success') {
      handleError(response)
    } else {
      return response.data.payload
    }
  } catch (e) {
    throw e
  }
}

function handleError (response: AxiosResponse) {
  const errorMsg = typeof response.data.payload === 'string' ? response.data.payload : 'Failed'
  if (response.data.payload === 'jwt expired') {
    // force logout user
    store.commit('logout')
  }
  throw new Error(errorMsg)
}

function hookRequest (config: AxiosRequestConfig) {
  if (store.state.token) {
    config.headers = config.headers || {}
    config.headers['x-access-token'] = store.state.token
  }
  if (store.state.adminMode) {
    config.params = config.params || {}
    config.params.forced = true
  }
}

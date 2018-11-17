import Axios, { AxiosRequestConfig } from 'axios'

const client = Axios.create({
  withCredentials: true
})

export const request = async (config: AxiosRequestConfig) => {
  try {
    const response = await client(config)
    if (response.data.status !== 'success') {
      const errorMsg = typeof response.data.payload === 'string' ? response.data.payload : 'Failed'
      throw new Error(errorMsg)
    } else {
      return response.data.payload
    }
  } catch (e) {
    throw e
  }
}

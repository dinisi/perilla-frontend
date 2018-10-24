import Axios, { AxiosRequestConfig } from "axios";

const client = Axios.create({
  baseURL: "http://localhost:3000"
});

export const request = async (config: AxiosRequestConfig) => {
  try {
    const response = await client(config);
    if (response.data.status !== "success") {
      throw new Error(response.data.payload);
    } else {
      return response.data.payload;
    }
  } catch (e) {
    throw e;
  }
};

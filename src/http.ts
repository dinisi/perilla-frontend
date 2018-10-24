import Axios, { AxiosRequestConfig } from "axios";

const client = Axios.create({
  withCredentials: true
});

export default async (config: AxiosRequestConfig) => {
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

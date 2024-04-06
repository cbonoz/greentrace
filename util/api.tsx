import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_SERVER_KEY;
const config: any = {
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  // set header
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": API_KEY || "123",
  },
};

if (config.baseURL.indexOf("localhost") > -1) {
  console.log("config", config);
}

export const axiosInstance = axios.create(config);

export const setKey = (key: string, value: any) => {
  return axiosInstance.post("/set", { key, value });
};

export const getKey = (key: string) => {
  return axiosInstance.get(`/get?key=${key}`);
};

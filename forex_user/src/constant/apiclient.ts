//base urls on admin part
import axios from "axios";
import { getToken, removeToken, setToken } from "../utils/getTocken";
import { io, Socket } from 'socket.io-client';
export const socketServerUrl = "wss://live.aynzenix.com/"
export const vtxSocketClient: Socket = io(socketServerUrl, {
  autoConnect: false,
  transports: ['websocket'],
  auth: (cb) => {
    cb({ token: getToken() });
  },
});
export const capMarketServer = axios.create({
  // baseURL: "http://localhost:3000/admin",
  baseURL: "https://api.aynzenix.com/user",
  // baseURL: "https://devserver.aynzenix.com/admin",
  withCredentials: true,
});
const logout = async () => {
  try {
    await capMarketServer.post("/admin-auth/logOut/");
  } catch (e) {
    console.log(e);
  } finally {
    removeToken()
    delete capMarketServer.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  }
};
const capMarketServerHeaders = (config: any) => {
  config.headers["User-Type"] = "user";
  const token = getToken();
  if (token && config.url !== "login/" && config.url !== "verify-otp/") {
    config.headers["Authorization"] = `Bearer ${token}`;
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
  }
  return config;
};
interface accessToken {
  data: {
    token: string
  }
};
export const getAccessToken = async () => {
  const response = await capMarketServer.post("/get-access-token");
  const accessToken = (response.data as accessToken).data.token;
  return accessToken;
};
const handle401Error = async (error: any) => {
  const originalRequest = error.config;
  if (
    error.response?.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    try {
      const newToken = await getAccessToken();
      setToken(newToken);
      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;
      return capMarketServer(originalRequest);
    } catch (err) {
      await logout();
      return Promise.reject(err);
    }
  }
  return Promise.reject(error);
};
capMarketServer.interceptors.request.use(capMarketServerHeaders);
capMarketServer.interceptors.response.use(
  (response) => response,
  handle401Error
);

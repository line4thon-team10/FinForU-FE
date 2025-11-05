import axios from "axios";
import i18next from "i18next";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const currentLang = i18next.language;
    config.headers["Accept-Language"] = currentLang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

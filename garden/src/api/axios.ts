import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      `${import.meta.env.VITE_GLOBUS_CLIENT_ID}:0948a6b0-a622-4078-b0a4-bfd6d77d65cf`,
    );
    if (token) {
      config.headers["Authorization"] = `Bearer ${JSON.parse(token).access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default instance;

import axios from "axios"

const axiosInstance=axios.create({
    baseURL:"http://localhost:8080/",
    timeout:1000,

    headers: {
    "Content-type": "application/json",
  },
})


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios from "axios"
// import Cookies from "js-cookie"


const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    timeout:15000,
    withCredentials:true,
    headers: {
    "Content-Type": "application/json",
  },
})   

axiosInstance.interceptors.request.use(
 (config) => {
    // Exclude token from these routes
    if (
      !config.url.endsWith("/admin/signup") &&
      !config.url.endsWith("/admin/login") && !config.url.endsWith("/user/signup") && !config.url.endsWith("/user/login")
    ) {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    console.log("no error");
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('call the refresh token api here')
      // Handle 401 error, e.g., redirect to login or refresh token
    }
    return Promise.reject(error)
  },
)

export default axiosInstance;

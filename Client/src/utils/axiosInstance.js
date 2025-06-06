import axios from "axios"
// import Cookies from "js-cookie"


const axiosInstance=axios.create({
    baseURL:"http://localhost:8080/",
    timeout:1000,
    credentials: "include",
    body:JSON.stringify({}),
    headers: {
    "Content-type": "application/json",
  },
})

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
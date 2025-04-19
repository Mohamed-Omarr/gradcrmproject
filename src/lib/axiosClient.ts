
import axios from "axios";
// import { jwtDecode } from 'jwt-decode';

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});



axiosClient.interceptors.request.use(
  async (config) => {   

     if(typeof window !=="undefined"){
      const accessToken = localStorage.getItem("access_token");
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // try {
    //   if (typeof window !=="undefined"){
    //     const accessToken = localStorage.getItem("access_token");
    //   if (accessToken) {
    //     const decoded = jwtDecode(accessToken);
    //     let isExpired;
    //     if (decoded.exp !== undefined) isExpired = decoded.exp * 1000 < Date.now(); 
    //     else console.error(decoded.exp,"undefined")
        
    //     if (!isExpired) {
    //       config.headers.Authorization = `Bearer ${accessToken}`;
    //     } else {
    //       const { data } = await axios.post("/api/crm/auth/refreshToken");
    //       config.headers.Authorization = `Bearer ${data.accessToken}`;
    //       console.log("start refreshing the access token")
    //       localStorage.setItem("access_token", data.accessToken);
    //     }
    //   };
    //   }
    // } catch (err) {
    //   console.log("vialed access Token error- must log out the user right now:", err);
    //   return Promise.reject(err);
    // }

    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.headers["Accept"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {

    // If token is expired and we haven't retried yet
    if (err.response?.status === 401) {
      // localStorage.removeItem("access_token");
      // window.location.href = "/crm/auth/login";
    }
  
    

    return Promise.reject(err);
  }
);


export default axiosClient;

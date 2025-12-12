
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { shopFrequentExit } from "../../../_lib_backend/token/shopFrequentExit";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/`,
  withCredentials: true,
});

let isRefresh = false;
let refreshSubscribers: ((token:string)=>void)[] = [];

function onRefreshed(token:string) {
  refreshSubscribers.forEach((callback)=>callback(token));
  refreshSubscribers = [];
}

function addRefreshedSubscriber(callback: (token:string) => void) {
  refreshSubscribers.push(callback)
}


axiosClient.interceptors.request.use(
  async (config) => {   

    if (typeof window ==="undefined") return config;

      try {
        const AccessToken = localStorage.getItem("AccessToken");
        
        if (!AccessToken) return config;

          const decoded = jwtDecode<{exp?:number}>(AccessToken);
          
          const isExpired= decoded.exp ? decoded.exp * 1000 < Date.now():true ;
            
          if (isExpired) {
            const retryOriginalRequest = new Promise<void>((resolve)=>{
              console.log("Queued for token:", config.url);
              addRefreshedSubscriber((token:string)=>{
                console.log("Got token for", config.url, "→", token);
                config.headers.Authorization = `Bearer ${token}`;
                resolve();
              });
            });

              if (!isRefresh){
                isRefresh = true;
                try{
                  const { data } = await axios.post("/api/shop/auth/refreshToken");
                  config.headers.Authorization = `Bearer ${data.AccessToken}`;
                  localStorage.setItem("AccessToken", data.AccessToken);
                  onRefreshed(data.AccessToken)
                  console.log("done refresh token")
                }catch(err){
                  shopFrequentExit();
                  throw err;
                }finally{
                  isRefresh = false;
                }
              }
            
            await retryOriginalRequest;
            return config;
          }
          config.headers.Authorization = `Bearer ${AccessToken}`;
      } catch (err) {
        console.log("vialed access Token error- must log out the user right now:", err);
        shopFrequentExit();
        return Promise.reject(err);
      }

    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {

    // If token is expired 
    if (err.response?.status === 401) {
      localStorage.removeItem("AccessToken");
      await shopFrequentExit();
    }
  
    return Promise.reject(err);
  }
);


export default axiosClient;

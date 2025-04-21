
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { frequentExit } from "../../_lib_backend/token/frequentExit";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/",
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
        const accessToken = localStorage.getItem("access_token");
        
        if (!accessToken) return config;

          const decoded = jwtDecode<{exp?:number}>(accessToken);
          console.log(decoded.exp );
          
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
                  const { data } = await axios.post("/api/crm/auth/refreshToken");
                  config.headers.Authorization = `Bearer ${data.accessToken}`;
                  localStorage.setItem("access_token", data.accessToken);
                  onRefreshed(data.accessToken)
                  console.log("done refresh token")
                }catch(err){
                  frequentExit();
                  throw err;
                }finally{
                  isRefresh = false;
                }
              }
            
            await retryOriginalRequest;
            return config;
          }
          config.headers.Authorization = `Bearer ${accessToken}`;
      } catch (err) {
        console.log("vialed access Token error- must log out the user right now:", err);
        frequentExit();
        return Promise.reject(err);
      }

    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
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
      localStorage.removeItem("access_token");
      frequentExit();
    }
  
    return Promise.reject(err);
  }
);


export default axiosClient;

import axios from "axios";
import { setUser, setError } from "../stores/userSlice"; 


// Create the Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, 
});

export const setUpAxiosInstance = (dispatch)=>
{
    axiosInstance.interceptors.response.use(
        (response)=> response,
        async (error) =>{
            const originalRequest = error.config;

            if(error.response?.status === 401 && !originalRequest._retry)
            {
                originalRequest._retry = true;

                try {
                    const response = await axiosInstance.post("/auth/refresh-token");

                    const user = response.data.user;
                    dispatch(setUser(user));

                    return axiosInstance(originalRequest);
                    
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    dispatch(setError("Session expired. Please login again."));
                    window.location.href = "/login";
                }

            }
            return Promise.reject(error);
        }
    )
}


export default axiosInstance;


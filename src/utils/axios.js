/**
 * axios setup to use mock service
 */

import axios from 'axios';
import { verifyToken } from 'contexts/JWTContext';

const axiosExtended = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const setTokenHeader = () => {
    //getting token from local storage
    const token = localStorage.getItem('serviceToken');
    //adding interceptor for Authorization
    const axiosReqIntercept = axiosExtended.interceptors.request.use(
        (config) => {
            if (token && verifyToken(token)) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                axiosExtended.interceptors.request.eject(axiosReqIntercept);
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosExtended.interceptors.response.use(
        (config) => {
            return config;
        },
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('serviceToken');
                location.reload();
            }
            return Promise.reject(error);
        }
    );
};

export default axiosExtended;

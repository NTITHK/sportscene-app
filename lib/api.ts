import axios from 'axios';
import Constants from 'expo-constants';


const extra = (Constants.expoConfig?.extra || {}) as any;
const baseURL: string = extra.apiBaseUrl || 'http://localhost:8000';
export const endpoints = {
login: extra.apiPaths?.login || '/auth/login',
register: extra.apiPaths?.register || '/auth/register',
forgot: extra.apiPaths?.forgot || '/auth/forgot',
members: extra.apiPaths?.members || '/members',
};


const api = axios.create({ baseURL, timeout: 15000 });


// Helpful logging for 404s and others
api.interceptors.response.use(
r => r,
err => {
if (err?.config) {
console.log('[API ERROR]', err?.response?.status, `${baseURL}${err.config.url}`);
}
return Promise.reject(err);
}
);


export default api;
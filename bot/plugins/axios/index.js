import axios from 'axios';

const Server = axios.create()
 
Server.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
})
 
Server.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return Promise.reject(error);
})
 
export default Server;


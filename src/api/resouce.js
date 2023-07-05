import axios from "axios";
import store from "../store/index";

let Axiso = axios.create({
    timeout: 3000,
    baseURL: process.env.VUE_APP_ChatGpt
})

// // 设置默认的请求头
Axiso.defaults.headers['Content-Type'] = 'application/json';

// http request 请求拦截器
Axiso.interceptors.request.use(
    config => {
        if (store.getters.token != "") {
            config.headers.Authorization = "Bearer "  +   store.getters.token
        }
        return config;
    },
    error => {
        return error;
    }
);

// 添加响应拦截器
Axiso.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response.data);
        } else {
            return Promise.reject(response.data);
        }
    },
    error => {
        if (error.response && error.response.status) {
            switch (error.response.status) {
                case 401:
                case 403:
                    sessionStorage.clear()
                    localStorage.clear()
                    store.dispatch('app/setToken', '')
                    store.dispatch('index/setDoorStatus', false)
                    break;
            }
        }
        if (error.response) {
            if (error.response.data) {
                return Promise.reject(error.response.data);
            }
            return Promise.reject(error.response);
        } else {
            return Promise.reject(error);
        }
    }
);
export default Axiso;
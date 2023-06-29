import axios from "axios";

let Axiso = axios.create({
    timeout: 3000,
    baseURL: process.env.VUE_APP_ChatGpt
})


// http request 请求拦截器
Axiso.interceptors.request.use(
    config => {
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
                case 404:
                    break;
            }
        }
        return Promise.reject(error.response);
    }
);
export default Axiso;
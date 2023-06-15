import axios from "axios";
import store from "@/store/index";
import router from "../router";

let Axiso = axios.create({
  timeout:5000,
  baseURL:process.env.VUE_APP_URL
})
//store.state.city_id = sessionStorage.getItem('city_id')
// http request 请求拦截器

Axiso.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token')) {
      store.state.app.token = sessionStorage.getItem('token')
    }
    config.headers.Authorization ="Bearer "  +   store.state.app.token
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
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          break;
        case 401:
            // sessionStorage.removeItem('token')
            // router.push({path:'/'})
            return
          break;
      }
    }
    return Promise.reject(error.response);
  }
);
export default Axiso;

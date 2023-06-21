import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import axios from "./api/resouce";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Fragment from 'vue-fragment' // element导航菜单折叠文字不隐藏 因为el-menu嵌套了组件意外的div

// import './mock/mock'

Vue.config.productionTip = false;
Vue.prototype.axios = axios;

// 替换
router.afterEach((to, from) => {
    if (to.fullPath.split('&').length > 1) {
        router.replace(to.fullPath.split('&')[0])
    }
});


Vue.use(ElementUI);
Vue.use(Fragment.Plugin)


new Vue({
    router,
    store,
    axios,
    render: h => h(App)
}).$mount("#app");
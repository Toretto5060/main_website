//引入vue，及store下面模块中的文件
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import index from './modules/index'
import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        index,
        app,
    },
    getters
})

export default store

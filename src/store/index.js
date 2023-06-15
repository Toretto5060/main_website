import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import index from './modules/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    index,
  },
  getters
})

export default store

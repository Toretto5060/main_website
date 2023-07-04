import Vue from 'vue'
const state = {
    token:''
}

const mutations = {
    SET_TOKEN: (state, str) => {
        state.token = str
    },
}

const actions = {
    setToken({ commit, state }, str) {
        return new Promise((resolve, reject) => {
            commit("SET_TOKEN", str)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
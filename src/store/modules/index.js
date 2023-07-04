import Vue from 'vue'
//index模块中的数据，及相应的数据操作
const state = {
    doorStatus: false,
}

const mutations = {
    SET_DOOR_STATUS: (state, str) => {
        state.doorStatus = str;
    },

    // SET_MAIN_TITLE: (state, str) => {
    //     state.menuState = str;
    // },

   
}
const actions = {
    setDoorStatus({ commit, state }, str) {
        return new Promise((resolve, reject) => {
            commit("SET_DOOR_STATUS", str)
        })
    },
    // setMainTitle({ commit, state }, str) {
    //     return new Promise((resolve, reject) => {
    //         commit("SET_MAIN_TITLE", str)
    //     })
    // },
    //
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
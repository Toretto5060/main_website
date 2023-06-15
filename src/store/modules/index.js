import Vue from 'vue'

// 首页数据映射
const state = {
    area: [],
}

const mutations= {
    SET_INDEX_STATE: (state, indexState) => {
        indexState.area = mapArea(indexState.area)
        for (let k in indexState) {
            Vue.set(state, k, indexState[k])
        }
    }
}
const actions = {
    setIndexStates({ commit, state }, newState) {
        return new Promise((resolve, reject) => {
            commit("SET_INDEX_STATE", newState)
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
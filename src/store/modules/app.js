import Vue from 'vue'
const state = {
    token:'',
}

const mutations= {
    SET_SCREEN_MULTIPLE: (state,num)=>{
        Vue.set(state, 'screen_multiple', num)
    }
}

const actions = {
    setScreenMultiple({ commit, state },num) {
        return new Promise((resolve, reject) => {
            commit("SET_SCREEN_MULTIPLE", num)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
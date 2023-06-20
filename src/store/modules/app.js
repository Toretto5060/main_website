import Vue from 'vue'
const state = {
    menuState:{
        show:true,  // 是否显示菜单
        background:'#545c64',  // 背景色
        textColor:'#fff',  // 字体颜色
        state: true,    // 打开关闭
    },
    menuList:[{
        title:'导航二',
        id:'2785',
        icon:'el-icon-menu',
        disabled:false,
        router:'',
    },{
        id:'456778',
        title:'导航三',
        icon:'el-icon-document',
        disabled:true,
        router:'',
    },{
        id:'3467878',
        title:'导航四',
        icon:'el-icon-setting',
        disabled:false,
        router:'',
    },{
        title:'导航一',
        id:'1',
        icon:'el-icon-location',
        disabled:false,
        children:[{
            id:'5247852',
            title:'分组一',
            children:[
                {
                    id:'242422',
                    title:'选项一',
                    router:''
                },
                {
                    id:'452452',
                    title:'选项二',
                    router:''
                },
                {
                    id:'24527',
                    title:'选项三',
                    router:''
                },
                {
                    id:'2427',
                    title:'选项四',
                    router:''
                },
            ]

        },{
            id:'254',
            title:'分组二',
            children:[
                {
                    id:'75757',
                    title:'选项一',
                    router:''
                },
                {
                    id:'424578',
                    title:'选项二',
                    router:''
                },
                {
                    id:'785545',
                    title:'选项三',
                    router:''
                }
            ]
        }]

    },]
}

const mutations = {
    SET_MENU_STATE: (state, Boolean) => {
        if ( typeof Boolean == 'boolean')
            Vue.set(state.menuState, 'state', Boolean)
        else
            console.error('setMenuState 参数类型错误，期望数据类型为Boolean')
    },
}

const actions = {
    setMenuState({ commit, state }, str) {
        return new Promise((resolve, reject) => {
            commit("SET_MENU_STATE", str)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
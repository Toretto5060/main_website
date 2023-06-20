//通过this.$store.getters获取相应的数据
const getters = {
    MenuState: state => state.app.menuState,
    MenuList: state => state.app.menuList,

}

export default getters
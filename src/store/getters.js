//通过this.$store.getters获取相应的数据
const getters = {
    doorStatus: state => state.index.doorStatus,
    token: state => state.app.token,
}

export default getters
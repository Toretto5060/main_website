<template>
  <div class="error-page">
    <div class="error-code">4<span>0</span>4</div>
    <div class="error-desc">啊哦~ 当前路由配置错误</div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack(){
      this.$router.go(-1);
    }
  }
}
</script>


<style scoped lang="less">
.error-page{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: transparent;
  box-sizing: border-box;
}
.error-code{
  line-height: 1;
  font-size: 250px;
  font-weight: bolder;
  color: #2d8cf0;
  animation: myfirst 1s infinite;
}
.error-code span{
  color: #00a854;
}
.error-desc{
  font-size: 30px;
  color: #f3f3f3;
}
.error-handle{
  margin-top: 30px;
  padding-bottom: 200px;
}
.error-btn{
  margin-left: 100px;
}
@keyframes myfirst {
  0% {
    letter-spacing: 8px;
    transform: translate(0px, 0px);
  }
  50% {
    letter-spacing: 10px;
    transform: translate(0px, -5px);
  }
  100% {
    letter-spacing: 8px;
    transform: translate(0px, 0px);
  }
}
</style>
<style lang="less">
  #app {
    left: 50%;
    transform: translate(-50%,-50%) !important;
  }

</style>
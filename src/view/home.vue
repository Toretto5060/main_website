<template>
  <div id="home">
      <div class="content">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {
  },
  data(){
    return{

    }
  },
  computed:{

  },
  mounted(){
  },
  methods:{


  }
};
</script>
<style lang="less">
  @font-face {
    font-family: 'pangmen';
    src: url('../utils/PangMenZhengDaoBiaoTiTi-1.ttf') format('truetype');
  }
  @font-face {
    font-family: 'biaotihei';
    src: url('../utils/YouSheBiaoTiHei-2.ttf') format('truetype');
  }
  #home {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .content {
      width: 100%;
      height: 100%;
      font-family: pangmen !important;
    }
  }
</style>
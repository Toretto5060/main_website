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
  #home {
    position: absolute;
    width: 100%;
    height: 100%;
    .content {
      width: 100%;
      height: 100%;
    }
  }
</style>
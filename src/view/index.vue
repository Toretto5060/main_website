<template>
  <div id="home">
    <zero-photo-swipe ref="zeroPhoto"></zero-photo-swipe>
    <div class="my-gallery">

      <figure style="float:left;margin-inline-start:0px;margin-inline-end:0px;" v-for="(item,index) in pictureList" :key="index">

        <!-- 图片处理 -->
        <template v-if="!/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(item.child[0].src)">
          <a :href="changeImgSrc(item.child[0].src)" data-size="10x10" download="false">
            <img   :id="'img' + index" :src="changeImgSrc(item.child[0].src)" download="false" v-if="item.child[0].src.indexOf('HEIC') == -1"  style="height:100%;border-radius: 5px;"  v-on:load="loadImgSize($event)"/>
            <img   :id="'img' + index" download="false"  v-else  style="height:100%;border-radius: 5px;"  v-on:load="loadImgSize($event)"/>
          </a>
        </template>

        <!-- 视频处理 -->
        <template v-else>
          <a :href="changeImgSrc(item.child[0].src)" data-size="10x10" download="false">
            <img :src="item.child[0].videoImg" download="false" alt="" style="height:100%;border-radius: 5px;"  v-on:load="loadImgSize($event)">
          </a>
        </template>

      </figure>

    </div>

  </div>
</template>
<script>
import { getAgePicture } from "../api/index"

import ZeroPhotoSwipe from "./PhotoSwipe.vue";
export default {
  name: 'home',
  components: {
    ZeroPhotoSwipe
  },
  data() {
    return {
      pictureList: [],
    }
  },
  computed:{
    changeImgSrc() {
      return (src)=>{
        return process.env.VUE_APP_ChatGpt + src
      }
    }
  },
  watch:{
    pictureList(value,old) {
        console.log(this.pictureList)
    }
  },
  mounted(){
    // 调用初始化图片photoswipe
    this.$refs.zeroPhoto.initPhotoSwipeFromDOM('.my-gallery')
    this.getPicture()
  },
  methods:{
    getPicture() {
      getAgePicture().then(res=>{
        let newArr = res.data
        newArr.map(item=>{
          item.child.map((items,index)=>{
            if(/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(items.src)) {
              let video = document.createElement("video");
              video.style = 'position:fixed; top: 9999px;left:9999px;z-index:-9999'
              video.preload = 'metadata'
              video.currentTime = 1   //截取的视频第一秒作为图片
              video.src = process.env.VUE_APP_ChatGpt + items.src

              video.addEventListener('loadedmetadata', () => {
                video.width = video.videoWidth
                video.height = video.videoHeight
              });

              video.setAttribute('crossOrigin', 'anonymous');

              document.body.appendChild(video)
              video.onloadeddata =   ()=> {

                let canvas = document.createElement('canvas')
                canvas.width = video.width
                canvas.height = video.height
                canvas.getContext('2d').drawImage(video, 0, 0, video.clientWidth, video.clientHeight)
                var oGrayImg = canvas.toDataURL('image/jpeg');
                video.remove()
                this.$set(items,'videoImg',oGrayImg)
              }
            }
          })
        })

        this.pictureList = newArr

      })
    },
    // cutPicture(item) {
    //   item = process.env.VUE_APP_ChatGpt + item
    //   let video = document.createElement("video");
    //   video.style = 'position:fixed; top: 9999px;left:9999px;z-index:-9999'
    //   video.preload = 'metadata'
    //   video.currentTime = 1   //截取的视频第一秒作为图片
    //   video.src = item
    //   video.setAttribute('crossOrigin', 'anonymous');
    //   video.width = 113
    //   video.height = 75
    //   document.body.appendChild(video)
    //   video.onloadeddata = function () {
    //     let canvas = document.createElement('canvas')
    //     canvas.width = 113
    //     canvas.height = 75
    //     canvas.getContext('2d').drawImage(video, 0, 0, video.clientWidth, video.clientHeight)
    //     var oGrayImg = canvas.toDataURL('image/jpeg');
    //
    //     item = oGrayImg
    //     this.remove()
    //     console.log(item)
    //     return item
    //   }
    //   // console.log(item)
    //
    //
    //   // return item
    // },
    /**
     * 加载图片结束时自动添加photoswipe需要的data-size
     * @param e
     */
    loadImgSize(e) {
      var target = e.currentTarget
      var x = target.clientWidth
      var y = target.clientHeight

      target.dataSize = `${x}x${y}`
      target.parentNode.setAttribute('data-size', `${x}x${y}`)
    }
  }
}
</script>
<style lang="less" scoped>
#home {
  .my-gallery {
    figure {
      position: relative;
      height: 200px;
      //overflow: hidden;

      img {
        height: 2rem;
      }

    }
  }
}

</style>
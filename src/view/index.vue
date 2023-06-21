<template>
  <div id="home">
    <zero-photo-swipe ref="zeroPhoto" :photos = "postItem" ></zero-photo-swipe>

    <div class="picList">
        <div style="float:left;margin-inline-start:0px;margin-inline-end:0px;"  v-for="(item,index) in pictureList" :key="index">
            <!-- 图片处理 -->
            <div v-if="!/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(item.child[0].src)" @click="showPhoto(item,index)">
<!--              v-if="item.child[0].src.indexOf('HEIC') == -1"-->
              <img   :id="'img' + index" :src="changeImgSrc(item.child[0].src)" draggable="false" v-on:error="imgerror(item.child[0].src)"  style="height:100%;border-radius: 5px;"  v-on:load="loadImgSize($event)"/>
<!--              <img   :id="'img' + index" draggable="false"  v-else  style="height:100%;border-radius: 5px;"  v-on:load="loadImgSize($event)"/>-->
            </div>

            <div v-else @click="showPhoto(item,index)">
              <!-- 视频处理 -->
              <img :src="item.child[0].videoImg" draggable="false" alt="" style="height:100%;border-radius: 5px;"  v-on:load="loadImgSize($event)">
            </div>

        </div>
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
      postItem:[]
    }
  },
  computed:{
    changeImgSrc() {
      return (src)=>{
        return  src
      }
    }
  },
  watch:{

  },
  mounted(){
    // 调用初始化图片photoswipe
    // this.$refs.zeroPhoto.initPhotoSwipeFromDOM('.my-gallery')
    this.getPicture()
  },
  methods:{
    showPhoto(item,index) {
      this.postItem = item.child
      // ract 当前点击img的位置  用于关闭图片预览缩小动画   data 需要显示的图片/视频数组
      this.$refs.zeroPhoto.openPhoto(event.target.getBoundingClientRect(),item.child)
    },
    imgerror(src) {
      // console.log(src)
      event.target.src = require('../assets/img_error.jpg')
    },
    getPicture() {
      getAgePicture().then(res=>{
        let newArr = res.data
        newArr.map(item=>{
          item.child.map((items,index)=>{
            items.src = process.env.VUE_APP_ChatGpt + items.src
            if(/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(items.src)) {
              let video = document.createElement("video");
              video.style = 'position:fixed; top: 9999px;left:9999px;z-index:-9999'
              video.preload = 'metadata'
              video.currentTime = 1   //截取的视频第一秒作为图片
              video.src = items.src

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
            items.title = items.title  + " " + (items.src.split('/').pop().split('.')[0]) +' ( '+ items.date + ' ) '
          })
        })

        this.pictureList = newArr
      })
    },
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
    .picList {
      position: relative;
      height: 2rem !important;
      //overflow: hidden;
      div {
        cursor: pointer;
        img {
          height: 2rem !important;
        }
      }
    }
    .my-gallery {
      width: 100%;
      float: left;
      img {
        height: 2rem !important;
      }
    }
}

</style>
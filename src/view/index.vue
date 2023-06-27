<template>
  <div id="index">
    <zero-photo-swipe ref="zeroPhoto" :photos = "postItem" ></zero-photo-swipe>

    <div class="picList" ref="picList" v-on:load="onDomLoad">
        <div   v-for="(item,index) in pictureList" :key="index" class="picListItem" @click="showPhoto(item,index)">
              <div class="album">
                <svg t="1687835237584" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8819" width="200" height="200">
                  <path d="M648.8576 451.3792c-55.9616 0-101.4784-45.5168-101.4784-101.4784s45.5168-101.4784 101.4784-101.4784 101.4784 45.5168 101.4784 101.4784-45.5168 101.4784-101.4784 101.4784z m0-172.1856c-39.0144 0-70.7584 31.744-70.7584 70.7584s31.744 70.7584 70.7584 70.7584 70.7584-31.744 70.7584-70.7584-31.744-70.7584-70.7584-70.7584z" fill="#FF4D7C" p-id="8820"></path><path d="M67.5328 431.1552c8.4992 0 15.36-6.8608 15.36-15.36v-27.5968c0-8.4992-6.8608-15.36-15.36-15.36s-15.36 6.8608-15.36 15.36v27.5968c0 8.4992 6.8608 15.36 15.36 15.36z" fill="#4C35D3" p-id="8821"></path>
                  <path d="M830.208 126.8224H186.3168c-73.984 0-134.144 60.16-134.144 134.144v30.0544c0 8.4992 6.8608 15.36 15.36 15.36s15.36-6.8608 15.36-15.36v-30.0544c0-57.0368 46.3872-103.424 103.424-103.424h643.8912c57.0368 0 103.424 46.3872 103.424 103.424v215.9616l-371.6608 154.4192-148.8896-152.1664c-21.3504-21.8112-55.04-26.88-81.8688-12.3392l-248.32 134.5536V479.1808c0-8.4992-6.8608-15.36-15.36-15.36s-15.36 6.8608-15.36 15.36V757.9136c0 73.984 60.16 134.144 134.144 134.144H830.2592c73.984 0 134.144-60.16 134.144-134.144V260.9152c-0.0512-73.9328-60.2112-134.0928-134.1952-134.0928zM190.6688 861.3376c-3.5328 0-7.0144-0.2048-10.4448-0.512-0.3072-0.0512-0.6144-0.0512-0.9728-0.1024-3.0208-0.3072-5.9904-0.8192-8.9088-1.3824l-2.4576-0.4608c-2.5088-0.5632-4.9664-1.1776-7.3728-1.8944l-3.1232-0.9216c-2.304-0.768-4.5568-1.5872-6.8096-2.5088-0.9728-0.3584-1.8944-0.768-2.8672-1.1776-2.3552-1.024-4.7104-2.1504-7.0144-3.3792-0.768-0.4096-1.5872-0.8192-2.3552-1.2288-2.4576-1.3824-4.8128-2.816-7.1168-4.352-0.512-0.3584-1.024-0.6656-1.4848-1.024-2.5088-1.7408-4.9664-3.5328-7.2704-5.4784l-0.7168-0.5632c-2.5088-2.0992-4.9664-4.3008-7.2704-6.6048 0-0.0512-0.0512-0.0512-0.0512-0.1024a107.34592 107.34592 0 0 1-31.5392-76.1344v-117.248l262.9632-142.4896c14.848-8.0384 33.4848-5.2224 45.312 6.8096l353.0752 360.6528H190.6688z m596.5312 0l-202.0352-206.3872 348.5184-144.7936v243.456c0 59.4432-48.3328 107.776-107.776 107.776h-38.7072z" fill="#fff" p-id="8822"></path>
                </svg>
                {{item.child.length}}
              </div>
              <!-- 图片处理 -->
              <img   :id="'img' + index" :src="changeImgSrc(item.child[0].src)" draggable="false" v-if="!/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(item.child[0].src)" v-on:error="imgerror(item.child[0].src)"   v-on:load="loadImgSize($event)"/>
              <!-- 视频处理 -->
              <img :src="item.child[0].videoImg" v-else draggable="false" alt=""   v-on:load="loadImgSize($event)">
              <div class="img_title">{{item.title}}</div>
        </div>


    </div>

  </div>
</template>
<script>
import { getAgePicture } from "../api/index"

import ZeroPhotoSwipe from "./PhotoSwipe.vue";

// import $ from 'jquery'
import justifiedGallery from "@/utils/jquery.justifiedGallery";
export default {
  name: 'home',
  components: {
    ZeroPhotoSwipe
  },
  data() {
    return {
      pictureList: [],
      postItem:[],
      listShow:false,
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
    this.getPicture()
    window.onload = () => {
      $(this.$refs.picList).justifiedGallery({
        rowHeight: 240,
        margins: 15
      });
    }

    this.$nextTick(()=>{
      setTimeout(()=>{
        $(this.$refs.picList).justifiedGallery({
          rowHeight: 240,
          margins: 15

        });
      },300)
    })

    window.onresize = () => {
      $(this.$refs.picList).justifiedGallery({
        rowHeight: 240,
        margins: 15
      });
    }

  },
  methods:{
    onDomLoad() {

    },
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
  #index {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .picList {
      width: 100%;
      height: 100%;
      position: relative;
      visibility: hidden;
      .picListItem {
        cursor: pointer;
        border-radius: 0.1rem;
        transition: all 0.3s;
        box-shadow:
            0px 4px 10px rgba(0, 0, 0, 0.2),
            2px 8px 6px rgba(0, 0, 0, 0.15);
        .album {
          width: 40px;
          height: 30px;
          //background: url("../assets/album.png") no-repeat;
          //background-size: 45% 60%;
          position: absolute;
          right: 5px;
          top: 5px;
          text-indent: 20px;
          font-weight: bold;
          z-index: 999;
          color: #fff;
          mix-blend-mode: difference;
          svg {
            width: 80%;
            height: 55%;
            position: absolute;
            left: -8px;
          }
        }
        .img_title {
            width: 90%;
            height: 0.25rem;
            line-height: 0.25rem;
            background: rgba(0,0,0,0.4);
            color: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            padding-left: 5%;
            padding-right: 5%;
            font-weight: bold;
            //padding: 0 0.1rem
        }

      }
      .picListItem:hover {
        transform-origin: center;
        transform: scale(1.1);
        transition: all 0.3s;
        z-index: 999;
      }
    }
    .justified-gallery {
      visibility: initial !important;
      overflow: initial !important;
    }
}

</style>
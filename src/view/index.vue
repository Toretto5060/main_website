<template>
  <div id="index">
    <zero-photo-swipe ref="zeroPhoto" :photos= "postItem" ></zero-photo-swipe>
    <div
          class="index_content"
          v-loading="loading"
          :style="{'overflow-y': loading ?'hidden' : 'auto'}"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
    >


      <div class="picList" ref="picList"  v-if="pictureList.length > 0">
        <div   v-for="(item,index) in pictureList" :key="index" class="picListItem" @click="showPhoto(item,index)">
          <i></i>
          <!--图册数量标识-->
          <div class="album">
            <svg t="1687835237584" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8819" width="200" height="200">
              <path d="M648.8576 451.3792c-55.9616 0-101.4784-45.5168-101.4784-101.4784s45.5168-101.4784 101.4784-101.4784 101.4784 45.5168 101.4784 101.4784-45.5168 101.4784-101.4784 101.4784z m0-172.1856c-39.0144 0-70.7584 31.744-70.7584 70.7584s31.744 70.7584 70.7584 70.7584 70.7584-31.744 70.7584-70.7584-31.744-70.7584-70.7584-70.7584z" fill="#FF4D7C" p-id="8820"></path><path d="M67.5328 431.1552c8.4992 0 15.36-6.8608 15.36-15.36v-27.5968c0-8.4992-6.8608-15.36-15.36-15.36s-15.36 6.8608-15.36 15.36v27.5968c0 8.4992 6.8608 15.36 15.36 15.36z" fill="#4C35D3" p-id="8821"></path>
              <path d="M830.208 126.8224H186.3168c-73.984 0-134.144 60.16-134.144 134.144v30.0544c0 8.4992 6.8608 15.36 15.36 15.36s15.36-6.8608 15.36-15.36v-30.0544c0-57.0368 46.3872-103.424 103.424-103.424h643.8912c57.0368 0 103.424 46.3872 103.424 103.424v215.9616l-371.6608 154.4192-148.8896-152.1664c-21.3504-21.8112-55.04-26.88-81.8688-12.3392l-248.32 134.5536V479.1808c0-8.4992-6.8608-15.36-15.36-15.36s-15.36 6.8608-15.36 15.36V757.9136c0 73.984 60.16 134.144 134.144 134.144H830.2592c73.984 0 134.144-60.16 134.144-134.144V260.9152c-0.0512-73.9328-60.2112-134.0928-134.1952-134.0928zM190.6688 861.3376c-3.5328 0-7.0144-0.2048-10.4448-0.512-0.3072-0.0512-0.6144-0.0512-0.9728-0.1024-3.0208-0.3072-5.9904-0.8192-8.9088-1.3824l-2.4576-0.4608c-2.5088-0.5632-4.9664-1.1776-7.3728-1.8944l-3.1232-0.9216c-2.304-0.768-4.5568-1.5872-6.8096-2.5088-0.9728-0.3584-1.8944-0.768-2.8672-1.1776-2.3552-1.024-4.7104-2.1504-7.0144-3.3792-0.768-0.4096-1.5872-0.8192-2.3552-1.2288-2.4576-1.3824-4.8128-2.816-7.1168-4.352-0.512-0.3584-1.024-0.6656-1.4848-1.024-2.5088-1.7408-4.9664-3.5328-7.2704-5.4784l-0.7168-0.5632c-2.5088-2.0992-4.9664-4.3008-7.2704-6.6048 0-0.0512-0.0512-0.0512-0.0512-0.1024a107.34592 107.34592 0 0 1-31.5392-76.1344v-117.248l262.9632-142.4896c14.848-8.0384 33.4848-5.2224 45.312 6.8096l353.0752 360.6528H190.6688z m596.5312 0l-202.0352-206.3872 348.5184-144.7936v243.456c0 59.4432-48.3328 107.776-107.776 107.776h-38.7072z" fill="#fff" p-id="8822"></path>
            </svg>
            <span v-html="item.child.length"></span>
          </div>
          <!-- 图片处理 -->
          <img   :id="'img' + index"  :src="changeImgSrc(item.child[0].src)" draggable="false" v-if="!/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test((item.child[0].src).split('?')[0])" v-on:error="imgerror(item.child[0].src)"   v-on:load="loadImgSize($event)"/>
          <!-- 视频处理 -->
          <img :src="item.child[0].videoImg" v-else draggable="false" alt=""   v-on:load="loadImgSize($event)">
          <div class="img_title">{{item.title}}</div>
        </div>
      </div>


      <!-- 暂无数据dom-->
      <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-60%)" v-else>
        <el-empty :image-size="200"></el-empty>
      </div>
    </div>
    <div :class="doorOpenType" ref="container">
      <div :class="'container_door ' + doorClass" ref="container_door">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="!listShow">
          <el-form-item  prop="input" :error="errorMsg">
            <el-input type="password" v-model="ruleForm.input"  @input="inputListen" placeholder="请输入口令" :maxlength="8"></el-input>
          </el-form-item>
        </el-form>
        <div class="left-part" ref="leftPart">
        </div>
        <div class="right-part">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAgePicture, loginInput} from "../api/index"
import ZeroPhotoSwipe from "./PhotoSwipe.vue";
import justifiedGallery from "@/utils/jquery.justifiedGallery";

export default {
  name: 'home',
  components: {
    ZeroPhotoSwipe,
  },
  data() {
    return {
      doorClass:'close',
      pictureList: [],
      postItem:[],
      listShow:false,
      doorOpenType:'container3D',  //container3D
      ruleForm:{
        input:'',
      },
      fontSize: Number(window.getComputedStyle(document.documentElement).fontSize.split('px')[0]/100),
      timerOut:null,
      loading: false,
      errorMsg:'',
      rules: {
        input: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入口令'));
              }
              else if (value.length < 6) {
                callback(new Error('口令长度不应小于6位'));
              } else
              {
                callback();
              }
            },
            trigger: 'change' }
        ],
      },
      isGalleryInitialized:false
    }
  },
  created() {
    if (this.$store.getters.doorStatus) {
      this.doorClass = "open"
      this.listShow = true
      this.ruleForm.input = ""
      this.getPicture()
      this.$nextTick(()=>{
        this.$refs.container.style.zIndex = -1

      })
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
    listShow() {
      if (this.listShow) {
        this.$refs.leftPart.addEventListener('transitionend', (event)=> {
          // 检查过渡属性是否为 left
          this.$refs.container.style.zIndex = -1
          this.ruleForm.input = ""
        });
      } else {
        this.$refs.leftPart.addEventListener('transitionend', (event)=> {
          // 检查过渡属性是否为 left
          this.$refs.container.style.zIndex = 9999
          this.ruleForm.input = ""
        });
      }
    },
    pictureList(newVal){
    }
  },
  mounted(){
    window.onresize = ()=>{
      this.initJustifiedGallery()
    }

    this.$store.watch((state, getters) => getters.doorStatus,() => {
      if (this.$store.getters.doorStatus) {
        this.doorClass = "open"
        this.listShow = true
        this.ruleForm.input = ""
        this.getPicture()
      } else {
        this.doorClass = "close"
        this.listShow = false
      }
    });
  },
  methods:{
    inputListen() {
      // 口令验证成功调用
      this.$refs['ruleForm'].validate((valid,fields) => {
        if (valid) {
          if (this.ruleForm.input.length < 8) {
            return
          }
          loginInput({password: this.ruleForm.input})
              .then(res=>{
                if (res.code == 200) {
                  this.$store.dispatch('app/setToken',res.data.token)
                  localStorage.setItem('token',res.data.token)
                  this.$store.dispatch('index/setDoorStatus',true)
                }
              })
              .catch(err=>{
                this.errorMsg = ""
                console.log(err)
                this.$nextTick(()=>{
                  this.errorMsg = err.message
                })
              })

        } else {
          return false;
        }

      });
    },
    initJustifiedGallery() {
      // 初始化justifiedGallery
      $(this.$refs.picList).justifiedGallery({
        lazyLoad: true,
        rowHeight: 240,
        margins: 15,
        captions: false,
        rel: 'myGallery',
      });
    },
    showPhoto(item) {
      // let showList = []
      // item.child.map(items=>{
      //   showList.push(items.src)
      // })
      this.$hevueImgPreview({
        imgTop: 100,
        multiple: true,
        nowImgIndex: 0,
        imgList: item.child
      })
      // this.$preview.show(0, this.pictureList); // 打开图片预览
      return
      this.postItem = item.child
      // ract 当前点击img的位置  用于关闭图片预览缩小动画   data 需要显示的图片/视频数组
      this.$refs.zeroPhoto.openPhoto(event.target.getBoundingClientRect(),item.child)
    },
    imgerror(src) {
      event.target.src = require('../assets/img_error.jpg')
    },
    getPicture() {
      this.loading = true
      getAgePicture().then(res=>{
        let newArr = res.data
        const promises = newArr.map(item=>{
          item.child.map((items,index)=>{
            items.src = process.env.VUE_APP_ChatGpt + items.src + '?Authorization=' + this.$store.getters.token
            items.sourceSrc = process.env.VUE_APP_ChatGpt + items.sourceSrc + '?Authorization=' + this.$store.getters.token
            // // 获取child 第一个数组的 视频缩略图
            if(index == 0 &&  /\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(items.src.split('?')[0])) {
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
      }).catch(err=>{
        this.loading = false
      })
    },
    /**
     * 加载图片结束时自动添加photoswipe需要的data-size
     * @param e
     */
    loadImgSize(e) {
      if (document.getElementsByClassName('jg-entry-visible').length != this.pictureList.length) {
        clearTimeout(this.timerOut)
        this.timerOut = null
        this.timerOut = setTimeout(() => {
          this.initJustifiedGallery();
          this.loading = false
        }, 500);
      }
    }
  }
}
</script>
<style lang="less" scoped>
  #index {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 103%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .index_content {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      overflow-x: hidden;
    }
    .picList {
      width: 100%;
      height: 100%;
      visibility: hidden;
      .picListItem {
        cursor: pointer;
        float: left;
        border-radius: 0.1rem;
        transition: all 0.3s;
        //position: relative;
        box-shadow:
            0px 4px 10px rgba(0, 0, 0, 0.2),
            2px 8px 6px rgba(0, 0, 0, 0.15);
        .album {
          width: 0.5rem;
          height: 0.25rem;
          //background: url("../assets/album.png") no-repeat;
          //background-size: 45% 60%;
          position: absolute;
          right: 0.05rem;
          bottom: 0;
          //font-weight: bold;
          z-index: 999;
          color: #fff;
          text-align: right;
          font-size: 0.1rem;
          span {
            float: right;
            height: 100%;
            margin-right: 0.05rem;
            line-height: 0.26rem;
          }
          svg {
            width: 0.15rem;
            height: 0.15rem;
            float: right;
            margin-top: 0.05rem;
          }
        }
        .img_title {
            width: 100%;
            height: 0.25rem;
            line-height: 0.26rem;
            background: rgba(0,0,0,0.4);
            color: #fff;
            position: absolute;
            bottom: 0;
            left: 0;

            //font-weight: bold;
            font-size: 0.1rem;
            text-indent: 0.1rem;
        }
      }
      //.picListItem:hover {
      //  transform-origin: center;
      //  transform: scale(1.1);
      //  transition: all 0.3s;
      //  z-index: 999;
      //}
    }
    .justified-gallery {
      visibility: initial !important;
      overflow: initial !important;
    }

    // 3D大门内开效果
    .container3D {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      overflow: hidden;
      z-index: 999;
      .container_door {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        perspective: 800px;
        z-index: 999;
        .left-part,
        .right-part {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          height: 100%;
          transition: transform 1s ease-in-out, box-shadow 1s ease-in-out;
          //box-shadow: -10px 15px 25px rgba(0, 0, 0, 0.2);
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .left-part {
          left: 0;
          background-color: #333;
          transform-origin: left;
          transform: rotateY(0deg) translateZ(0px);
        }

        .right-part {
          right: 0;
          background-color: #ccc;
          transform-origin: right;
          transform: rotateY(0deg) translateZ(0px);
        }
      }
      .open {
        .left-part {
          transform: rotateY(140deg) translateZ(0px);
          box-shadow: 10px 15px 25px rgba(0, 0, 0, 0.2);
        }
        .right-part {
          transform: rotateY(-140deg) translateZ(0px);
          box-shadow: 10px 15px 25px rgba(0, 0, 0, 0.2);
        }
      }
      .close {
        .left-part {
          transform: rotateY(0deg) translateZ(0px);
          box-shadow: -10px 15px 25px rgba(0, 0, 0, 0.2);
        }
        .right-part {
          transform: rotateY(0deg) translateZ(0px);
          box-shadow: -10px 15px 25px rgba(0, 0, 0, 0.2);
        }
      }
    }
    // 大门平移开门效果
    .container {
      position: fixed;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      overflow: hidden;
      z-index: 9999999;
      .container_door {
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        z-index: 9999999;
        .left-part,
        .right-part {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          transition: transform 1s ease-in-out;
        }

        .left-part {
          background-color: #333;
          transform: translateX(-50%);
        }

        .right-part {
          background-color: #ccc;
          transform: translateX(50%);
        }
      }
      .open {
        .left-part {
          transform: translateX(-100%);
        }
        .right-part {
          transform: translateX(100%);
        }
      }
      .close {
        .left-part {
          transform: translateX(-50%);
        }
        .right-part {
          transform: translateX(50%);
        }
      }
    }

  }

</style>

<style lang="less">
  #index {
    .el-form {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 999;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    .el-input /deep/ .el-input__inner {
      border: none;
    }
    .el-input__inner:focus {
      outline: 0 !important;
      border: none !important;
    }
    .el-input__inner {
      outline: 0 !important;
      border: none !important;
    }
    //.el-input {
    //  width: 3rem;
    //  position: absolute;
    //  top: 50%;
    //  left: 50%;
    //  border: none !important;
    //  transform: translate(-50%,-50%);
    //  z-index: 9999;
      input {
        text-align: center;
      }
    //}
    ::placeholder {
      text-align: center;
    }


  }

</style>
<template>
  <transition name="fade">
    <div
      class="hevue-imgpreview-wrap"
      id="hevue-imgpreview-wrap"
      v-if="visible"
      ref="heImg"
      @mouseup="removeMove('pc')"
      @touchend="removeMove('mobile')"
      @click.stop="clickMask"
    >

      <div class="he-img-wrap">

        <el-carousel :interval="4000" indicator-position="outside" arrow="never" :autoplay="false" indicatorPosition="none"  ref="carousel" @change="carouselChange">
          <el-carousel-item v-for="(items,index) in imgSrcList" :key="index">

            <!--图片加载loading-->
            <div
                class="heimgfont hevue-img-status-icon rotate-animation"
                v-show="items.imgState === 1"
            >
              &#xe6b1;
            </div>
            <!---视频播放按钮--->
            <div class="playing" v-if="!videoPlaying && (items.imgState === 2 && items.video)">
              <img src="./iconfont/play.png" alt=""  @click="playVideo">
            </div>
            <!--图片显示-->
            <img
                :src="items.imgurl"
                ref="heImView"
                @click.stop=""
                v-show="items.imgState === 2 && !videoPlaying"
                class="he-img-view"
                :style="
            'transform: scale(' +
            imgScale +
            ') rotate(' +
            imgRotate +
            'deg);margin-top:' +
            imgTop +
            'px;margin-left:' +
            imgLeft +
            'px;' +
            maxWH
          "
                @mousedown="addMove"
                @touchstart="addMoveMobile"
            />
            <!---视频播放--->
            <video
                controls
                autoplay
                v-if="videoPlaying"
                ref="video"
                :src="videoSrc"
                :style="
            'transform: scale(' +
            imgScale +
            ') rotate(' +
            imgRotate +
            'deg);' +
            'max-width:100%;max-height: 100%'
          "
            ></video>
            <!-- 图片加载失败 -->
            <div class="heimgfont hevue-img-status-icon" v-show="items.imgState === 3">
              &#xec0d;
            </div>

          </el-carousel-item>
        </el-carousel>




        <!-- 关闭按钮 -->
        <div
          class="heimgfont he-close-icon"
          @click.stop="close({ way: 'closeBtn' })"
          v-if="closeBtn"
        >
          &#xe608;
        </div>
        <!-- 左箭头 -->
        <div
          class="arrow arrow-left heimgfont"
          @click.stop="toogleImg(false, 'btn')"
          v-if="arrowBtn && multiple"
        >
          &#xe620;
        </div>
        <!-- 右箭头 -->
        <div
          class="arrow arrow-right heimgfont"
          @click.stop="toogleImg(true, 'btn')"
          v-if="arrowBtn && multiple"
        >
          &#xe60d;
        </div>
        <!-- 控制条 -->
        <div class="he-control-bar-wrap" v-if="controlBar && !imgList[imgIndex].video">
          <div class="he-control-bar" @click.stop>
            <!-- 缩小 -->
            <div
              class="he-control-btn heimgfont"
              @click.stop="scaleFunc(-0.15)"
            >
              &#xe65e;
            </div>
            <!-- 放大 -->
            <div class="he-control-btn heimgfont" @click.stop="scaleFunc(0.15)">
              &#xe65d;
            </div>
            <!-- 复位 -->
            <div
              class="he-control-btn heimgfont"
              v-show="isFull"
              @click.stop="imgToggle"
            >
              &#xe698;
            </div>
            <!-- 复位 -->
            <div
              class="he-control-btn heimgfont"
              v-show="!isFull"
              @click.stop="imgToggle"
            >
              &#xe86b;
            </div>
            <!-- 左转 -->
            <div class="he-control-btn heimgfont" @click.stop="rotateFunc(-90)">
              &#xe670;
            </div>
            <!-- 右转 -->
            <div class="he-control-btn heimgfont" @click.stop="rotateFunc(90)">
              &#xe66f;
            </div>
            <!-- 下载 -->
            <!-- <div class="he-control-btn heimgfont" @click.stop="downloadIamge">
              &#xe694;
            </div> -->
          </div>
        </div>
        <!-- 页码指示器 -->
        <div class="he-control-num" v-if="controlBar && multiple">
          {{ imgIndex + 1 }} / {{ imgList.length }}
        </div>
        <!---图片/视频描述--->
        <div class="he-control-title" v-if="controlBar && multiple">
          {{ imgList[imgIndex].title }}
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'hevue-img-preview',
  data() {
    return {
      // imgWidth: 0,
      // imgHeight: 0,
      videoSrc: '',
      videoPlaying:false,
      visible: false, // 插件显示，默认为false
      imgScale: 1,
      imgTop: 0,
      imgLeft: 0,
      imgRotate: 0,
      isFull: false,
      maxWH: 'max-width:100%;max-height:100%;',
      clientX: 0,
      clientY: 0,
      imgIndex: 0,
      canRun: true,
      imgSrcList:[{
        imgurl:'',
        imgState: 1,
        video: false
      },{
        imgurl:'',
        imgState: 1,
        video:false
      },{
        imgurl:'',
        imgState: 1,
        video: false
      },],
      imgDomIndex: 0,
      startPoint:0,
      stopPoint: 0,
      start: [{}, {}],
      mobileScale: 0, // 手指离开时图片的缩放比例
      // 以下内容为用户传入配置
      // show: true, // 插件显示，默认为false
      url: '', // 预览图片的地址
      nowImgIndex: 0,
      multiple: false,
      imgList: [],
      // 以下为可全局配置
      controlBar: true,
      closeBtn: true,
      arrowBtn: true,
      keyboard: false,
      clickMaskCLose: false, // 是否点击遮罩关闭，默认false
      closeFn: null, // 关闭回调函数
      changeFn: null, // 切换图片回调函数
    }
  },
  mounted() {
    this.initImg()
  },
  watch: {
    videoPlaying() {
      if (!this.videoPlaying) {
        this.videoSrc = ""
      }
    },
    url() {
      this.initImg()
    },
    visible: {
      handler(newV) {
        if (newV) {
          this.$nextTick(() => {
            let _dom = document.getElementById('hevue-imgpreview-wrap')
            _dom.onmousewheel = this.scrollFunc
            // 火狐浏览器没有onmousewheel事件，用DOMMouseScroll代替(滚轮事件)
            document.body.addEventListener('DOMMouseScroll', this.scrollFunc)
            // 禁止火狐浏览器下拖拽图片的默认事件
            document.ondragstart = function () {
              return false
            }
            // 判断是否多图
            if (this.multiple) {
              if (Array.isArray(this.imgList) && this.imgList.length > 0) {
                this.imgIndex = Number(this.nowImgIndex) || 0
                // this.url = this.imgList[this.imgIndex]
                this.changeUrl(this.imgList[this.imgIndex], this.imgIndex)
              } else {
                // console.error("imgList 为空或格式不正确");
              }
            } else {
              this.changeUrl(this.url)
            }
            // 判断是否开启键盘事件
            if (this.keyboard) {
              document.addEventListener('keydown', this.keyHandleDebounce)
            }
            this.slideBanner();
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    startAuto(){
      if(this.autoplay == false){
        this.autoplay = true;
      }
    },
    stopAuto(){
      if(this.autoplay == true){
        this.autoplay = false;
      }
    },
    slideBanner(){
      let vm = this
      //选中item的盒子
      var box = document.querySelector('.el-carousel__container');

      // 阈值，用于控制pc滑动的最小变化量
      let threshold = 100;

      //重置坐标
      var resetPoint =  function(){
        vm.startPoint = 0;
        vm.stopPoint = 0;
      }

      //鼠标按下
      box.addEventListener("mousedown",function(e){
        //手指按下的时候停止自动轮播
        vm.stopAuto();

        vm.startPoint = e.pageX;
        vm.stopPoint = e.pageY;

        //鼠标滑动

        box.addEventListener("mousemove",vm.mousemove_change);

      });


      //当鼠标抬起抬起的时候，判断图片滚动离左右的距离
      box.addEventListener("mouseup",function(e){
        box.removeEventListener('mousemove',vm.mousemove_change);
        const currentMouseX = e.pageX;
        const currentMouseY = e.pageY;

        // 比较当前鼠标位置和上一次记录的鼠标位置
        const deltaX = currentMouseX - vm.startPoint;
        const deltaY = currentMouseY - vm.stopPoint;

        if (vm.imgList.length > 1) {
          // 判断移动方向
          if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
              // console.log('向右滑动');
              resetPoint();
              vm.toogleImg(false)
              // vm.$refs.carousel.prev();
              return;
            } else {
              // console.log('向左滑动');
              resetPoint();
              vm.toogleImg(true)
              // vm.$refs.carousel.next();
              return;
            }
          }
        }

        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            // console.log('向下滑动');
            vm.close({way: 'closeBtn'})
          } else {
            console.log('向上滑动');
          }
        }

        // 更新上一次鼠标位置
        vm.startPoint = currentMouseX;
        vm.stopPoint = currentMouseY;

      });


      //手指按下
      box.addEventListener("touchstart",function(e){
        //手指按下的时候停止自动轮播
        vm.stopAuto();

        vm.startPoint = e.changedTouches[0].pageX;
        vm.stopPoint = e.changedTouches[0].pageY;
      });

      //手指滑动
      box.addEventListener("touchmove",function(e){
        //手指滑动后终点位置X的坐标
        // stopPoint = e.changedTouches[0].pageX;
      });

      //当手指抬起的时候，判断图片滚动离左右的距离
      box.addEventListener("touchend",function(e){
        threshold = 50

        const currentMouseX = e.changedTouches[0].pageX;
        const currentMouseY = e.changedTouches[0].pageY;

        // 比较当前鼠标位置和上一次记录的鼠标位置
        const deltaX = currentMouseX - vm.startPoint;
        const deltaY = currentMouseY - vm.stopPoint;

        if (vm.imgList.length > 1) {
          // 判断移动方向
          if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
              // console.log('向右滑动');
              resetPoint();
              vm.toogleImg(false)
              // vm.$refs.carousel.prev();
              return;
            } else {
              // console.log('向左滑动');
              resetPoint();
              vm.toogleImg(true)
              // vm.$refs.carousel.next();
              return;
            }
          }
        }

        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            // console.log('向下滑动');
            vm.close({way: 'closeBtn'})
          } else {
            console.log('向上滑动');
          }
        }

        // 更新上一次鼠标位置
        vm.startPoint = currentMouseX;
        vm.stopPoint = currentMouseY;
      });
    },

    mousemove_change(e) {
      return
      //手指滑动后终点位置X的坐标
      const currentMouseX = e.pageX;
      const currentMouseY = e.pageY;
      let threshold = 100
      // 比较当前鼠标位置和上一次记录的鼠标位置
      const deltaX = currentMouseX - this.startPoint;
      // 判断移动方向
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          e.target.style.transform = "translateX("+deltaX+"px) scale(1)"
          return;
        } else {
          e.target.style.transform = "translateX("+deltaX+"px) scale(1)"
          return;
        }
      }
    },


    playVideo() {
      this.videoSrc = this.imgList[this.imgIndex].src
      this.videoPlaying = true
    },
    show() {
      this.visible = true
    },
    close(data) {
      this.initImg()
      // this.maxWH = "max-width:100%;max-height:100%;";
      // this.isFull = false;
      // 移除火狐浏览器下的鼠标滚动事件
      document.body.removeEventListener('DOMMouseScroll', this.scrollFunc)
      //恢复火狐及Safari浏览器下的图片拖拽
      document.ondragstart = null
      // 移除键盘事件
      if (this.keyboard) {
        document.removeEventListener('keydown', this.keyHandleDebounce)
      }
      this.visible = false
      this.closeFn && this.closeFn(data)
    },

    initImg() {
      this.mobileScale = 1
      this.imgScale = 1
      this.imgRotate = 0
      this.imgTop = 0
      this.imgLeft = 0
    },

    /** 切换图片 true 下一张 false 上一张   */
    toogleImg(bool, way) {
      let fromIndex = this.imgIndex
      if (bool) {
        this.imgIndex++
        if (this.imgIndex > this.imgList.length - 1) {
          this.imgIndex = 0
        }
        this.$refs.carousel.next();
      } else {
        this.imgIndex--
        if (this.imgIndex < 0) {
          this.imgIndex = this.imgList.length - 1
        }
        this.$refs.carousel.prev();
      }

      // this.changeFn &&
      //   this.changeFn({
      //     type: bool ? 'next' : 'prev',
      //     fromImgIndex: fromIndex,
      //     fromImgUrl: this.imgList[fromIndex],
      //     toImgIndex: this.imgIndex,
      //     toImgUrl: this.imgList[this.imgIndex],
      //     way,
      //   })
      // // this.url = this.imgList[this.imgIndex]
      this.changeUrl(this.imgList[this.imgIndex], this.imgIndex)
    },

    /***获取当前 swiper 下标***/
    carouselChange(index) {
      this.imgDomIndex = index
      this.imgSrcList[index].imgState = 1
    },

    /*** 当前需要显示的item ***/
    /**
     * @description:
     * @param {String} url 要显示的图片的url
     * @param {Number} index 当前显示当图片下标，防止用户点击切换图片过快
     * @return {*}
     */
    changeUrl(url, index) {
      this.videoPlaying = false
      this.imgList[this.imgIndex].video = false
      this.imgList.length > 1 ? this.arrowBtn = true : this.arrowBtn = false
      let img = new Image()
      if (typeof url == 'object') {
        if(/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(url.src.split('?')[0])) {
          this.imgList[this.imgIndex].video = true
          let video = document.createElement("video");
          video.style = 'position:fixed; top: 9999px;left:9999px;z-index:-9999'
          video.preload = 'metadata'
          video.currentTime = 1   //截取的视频第一秒作为图片
          video.src = url.src
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
            img.src = oGrayImg
          }
        }
        else {
          img.src = url.src
        }

      } else {
        img.src = url
      }
      this.imgload(img,index,url)
    },

    /*** 图片加载完毕 ***/
    imgload(img,index,item) {
      // this.imgSrcList[this.imgDomIndex].video = true
      img.onload = () => {
        // 如果加载出来图片当下标不是当前显示图片当下标，则不予显示（用户点击过快当时候，会出现用户点到第三张了，此时第一张图片才加载完当情况）
        if (index != undefined && index == this.imgIndex) {
          if(item.video) {
            this.imgSrcList[this.imgDomIndex].video = true
          } else {
            this.imgSrcList[this.imgDomIndex].video = false
          }
          this.imgSrcList[this.imgDomIndex].imgState = 2
          this.imgSrcList[this.imgDomIndex].imgurl = img.src
        } else if (index == undefined) {
          if(item.video) {
            this.imgSrcList[this.imgDomIndex].video = true
          } else {
            this.imgSrcList[this.imgDomIndex].video = false
          }
          this.imgSrcList[this.imgDomIndex].imgState = 2
          this.imgSrcList[this.imgDomIndex].imgurl = img.src
        }
      }
      img.onerror = () => {
        this.imgSrcList[this.imgDomIndex].video = false
        if (index != undefined && index == this.imgIndex) {
          this.imgSrcList[this.imgDomIndex].imgState = 3
        } else if (index == undefined) {
          this.imgSrcList[this.imgDomIndex].imgState = 3
        }
      }

    },
    // 旋转图片
    rotateFunc(deg) {
      this.imgRotate += deg
    },
    // 图片缩放
    scaleFunc(num, bool) {
      if (this.imgScale <= 0.2 && num < 0) return
      if (bool) {
        this.imgScale = num
      } else {
        this.imgScale += num
      }
    },
    // 图片原尺寸切换
    imgToggle() {
      this.initImg()
      if (this.isFull) {
        this.maxWH = 'max-width:100%;max-height:100%;'
      } else {
        this.maxWH = ''
      }
      this.isFull = !this.isFull
    },
    // 鼠标滚轮缩放
    scrollFunc(e) {
      e = e || window.event
      // e.returnValue = false // ie
      // 火狐下没有wheelDelta，用detail代替，由于detail值的正负和wheelDelta相反，所以取反
      e.delta = e.wheelDelta || -e.detail

      e.preventDefault()
      if (e.delta > 0) {
        //当滑轮向上滚动时
        this.scaleFunc(0.05)
      }
      if (e.delta < 0) {
        //当滑轮向下滚动时
        this.scaleFunc(-0.05)
      }
    },
    // 鼠标按下
    addMove(e) {
      return
      e = e || window.event
      this.clientX = e.clientX
      this.clientY = e.clientY
      this.$refs.heImg.onmousemove = this.moveFunc
    },
    // 手指按下事件
    addMoveMobile(e) {
      return
      e.preventDefault()
      e = e || window.event
      if (e.touches.length > 1) {
        this.start = e.touches
      } else {
        this.clientX = e.touches[0].pageX
        this.clientY = e.touches[0].pageY
      }
      // 添加手指拖动事件
      this.$refs.heImg.ontouchmove = this.moveFuncMobile
    },
    // 鼠标拖动
    moveFunc(e) {
      e = e || window.event
      e.preventDefault()
      let movementX = e.clientX - this.clientX
      let movementY = e.clientY - this.clientY
      // event.clientY;
      this.imgLeft += movementX * 2
      this.imgTop += movementY * 2
      this.clientX = e.clientX
      this.clientY = e.clientY
    },
    // 手指拖动
    moveFuncMobile(e) {

      return
      e = e || window.event
      if (e.touches.length > 1) {
        var now = e.touches
        var scale =
          this.getDistance(now[0], now[1]) /
          this.getDistance(this.start[0], this.start[1])
        // 判断是否手指缩放过，如果缩放过，要在上次缩放的比例基础上进行缩放
        if (this.mobileScale) {
          if (scale > 1) {
            // 放大
            this.scaleFunc(scale + this.mobileScale - 1, true)
          } else {
            // 缩小
            this.scaleFunc(scale * this.mobileScale, true)
          }
        } else {
          this.scaleFunc(scale, true)
        }
      } else {
        let touch = e.touches[0]
        e.preventDefault()
        let movementX = touch.pageX - this.clientX
        let movementY = touch.pageY - this.clientY
        // event.clientY;
        this.imgLeft += movementX * 2
        this.imgTop += movementY * 2
        this.clientX = touch.pageX
        this.clientY = touch.pageY
      }
    },
    // 移除拖动事件
    removeMove(type) {
      if (type === 'pc') {
        this.$refs.heImg.onmousemove = null
      } else {
        this.mobileScale = this.imgScale
        this.$refs.heImg.ontouchmove = null
      }
    },
    keyHandleDebounce(e) {
      if (this.canRun) {
        // 如果this.canRun为true证明当前可以执行函数
        this.keyHandle(e)
        this.canRun = false // 执行函数后一段时间内不可再次执行
        setTimeout(() => {
          this.canRun = true // 等到了我们设定的时间之后，把this.canRun改为true，可以再次执行函数
        }, 300)
      }
    },
    // 键盘事件
    keyHandle(e) {
      e = window.event || e
      var key = e.keyCode || e.which || e.charCode
      switch (key) {
        case 27: // esc
          this.close({ way: 'esc' })
          break
        case 65: // a键-上一张
          if (this.multiple) {
            this.toogleImg(false, 'key-a')
          }
          break
        case 68: // d键-下一张
          if (this.multiple) {
            this.toogleImg(true, 'key-d')
          }
          break
        case 87: // w键-放大
          this.scaleFunc(0.15)
          break
        case 83: // s键-缩小
          this.scaleFunc(-0.15)
          break
        case 81: // q键-逆时针旋转
          this.rotateFunc(-90)
          break
        case 69: // e键-顺时针旋转
          this.rotateFunc(90)
          break
        case 82: // r键-复位键
          this.initImg()
          break

        default:
          break
      }
    },
    // 点击遮罩层
    clickMask() {
      if (this.clickMaskCLose) {
        this.close({ way: 'mask' })
      }
    },
    //缩放 勾股定理方法-求两点之间的距离
    getDistance(p1, p2) {
      var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY
      return Math.sqrt(x * x + y * y)
    },
    /**
     * @description:
     * @param {String} imgsrc
     * @param {*} name
     * @return {*}
     */
    downloadIamge() {
      //下载图片地址和图片名
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = 'photo' + +new Date() // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.onerror = function (err) {
        console.log('图片信息不正确或图片服务器禁止访问')
        console.log(err)
      }
      if (this.multiple) {
        image.src = this.imgList[this.imgIndex]
      } else {
        image.src = this.url
      }
    },
  },
}
</script>

<style scoped>
@import './iconfont/iconfont.css';
@import './css/default.css';
</style>

<style lang="less">
  .hevue-imgpreview-wrap {
    background: rgba(0,0,0,1);
    -webkit-tap-highlight-color:transparent;
    .el-carousel {
      width: 100%;
      height: 100%;
      max-height: 88.5% !important;
      .el-carousel__item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .el-carousel__container {
        width: 100%;
        height: 100%;
      }
    }
    .el-carousel--horizontal {
      overflow-x: initial !important;
    }
    .he-img-wrap {
      background: transparent !important;
      video {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }
      img {
        max-height: 100%;
        //transform: scale(0.9) !important;
      }
      .he-control-title {
        //width: 100%;
        max-width: 420px;
        position: absolute;
        bottom: 0;
        background: rgba(0,0,0,0.4);
        padding: 0.15rem 0.1rem;
        font-family: pangmen !important;
        z-index: 99;
        font-size: 0.14rem;
        text-align: left !important;
        //text-indent: 0.2rem
      }
    }
    .playing {
      position: absolute;
      top: -6%;
      width: 100%;
      height: 115%;
      z-index: 99;
      background-color: rgba(0,0,0,0.4);
      img {
        display: block;
        width: 100px;
        height: 100px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        //transform: translate(-50%,-50%);
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.3s ease;
      }
      img:hover {
        opacity: 1;
        transition: all 0.3s ease;
        transform-origin: center;
        transform: scale(1.3);
      }
      .fullscreen {
        z-index: 9999;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        transform: scale(1.5);
      }
    }
  }
  .hevue-imgpreview-wrap::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(3px);
    opacity: 0.9; /* 控制透明度，可根据需要调整 */
  }


</style>

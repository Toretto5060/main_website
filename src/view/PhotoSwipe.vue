<template>
  <!-- 这段html代码，是用来显示图片弹出层的，是由photoswipe提供的 -->
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

      <!-- 图片列表-->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>

      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">

          <!--  Controls are self-explanatory. Order can be changed. -->

          <div class="pswp__counter"></div>

          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

          <!-- <button class="pswp__button pswp__button--share" title="Share"></button> -->

          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
          <!--
                    <button >放大</button>
                    <button >缩小</button>
                    <button >复原</button>

                    <button class="pswp__button" title="play">play</button>
                    -->
          <div :style="{width:'44px',height:'44px',color:'#ffffff',float:'right',cursor: 'pointer',display: 'flex',justifyContent: 'center',alignItems: 'center'} "@click="play">
            <img id="playbutton" src="../assets/play.png" style="width:18px;display: block"/>
          </div>

          <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>

        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
        </button>

        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
        </button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>

      </div>

    </div>
  </div>
</template>
<script>
//import { getCurrentInstance } from 'vue'
// 引入photoswipe的js和css文件
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

export default {
  name: 'ZeroPhotoSwipe',
  props:{
    photos:{
      type: Array,
      default:()=>{
        return []
      }

    }
  },
  data:function () {
    return {
      num:123,
      gallery:null,
      isPlaying:false,
      interval:null,
      clickNum: 0,
      timerOut: null
    }
  },
  watch:{
  },
  methods: {
    //自动播放执行的内容
    autoplay:function (){
      this.gallery.next();
      this.settransition()
    },
    //播放图片列表
    play:function() {
      if (this.isPlaying === true) {
        this.stop();
      } else {
        this.isPlaying = true;
        //console.log(this.gallery);

        document.getElementById('playbutton').src=  require("../assets/stop.png");
        this.interval = setInterval(this.autoplay,2000);
      }
    },
    //停止播放
    stop:function () {
      clearInterval(this.interval);
      this.isPlaying = false;
      this.cleartransition();
      document.getElementById('playbutton').src=require("../assets/play.png");
    },
    //关闭transition
    cleartransition: ()=> {
      let containers = document.getElementsByClassName("pswp__container");
      let container = containers[0];
      container.style.transition = '';
    },
    settransition: ()=> {
      let containers = document.getElementsByClassName("pswp__container");
      let container = containers[0];
      container.style.transition = 'all 0.3s';
    },
    stopVideo(){
      let video = document.querySelector('.video')
      if (video && !video.paused) {
        video.pause();
      }
    },
    //判断是否移动端的函数
    isMobileFunc:function() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      if (flag === null) {
        return 0;
      } else {
        return 1;
      }
    },
    getImageSize(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };
        img.src = url;
      });
    },
    createElement(node) {
      if (typeof node === 'string') {
        return document.createTextNode(node);
      } else {
        if (node && node.type) {
          const $el = document.createElement(node.type);
          if (node.value) {
            $el.innerHTML = node.value
          }
          if (node.props) {
            for(var i in node.props) {
              $el.setAttribute(i,node.props[i])
            }
          }
          if (node.click) {
            $el.onclick = node.click
          }
          if (node.children) {
            node.children.map(this.createElement).forEach($el.appendChild.bind($el));
          }
          return $el;
        }
      }
    },
    // 防止路径中存在中文被转译
    encodeChineseInUrl(url) {
      let chineseRegexp = /[\u4e00-\u9fa5]+/;
      let encodedUrl = encodeURI(url);

      let chinesePart = encodedUrl.match(chineseRegexp);
      let encodedChinesePart = encodeURIComponent(chinesePart);

      let decodedUrl = encodedUrl.replace(chinesePart, encodedChinesePart);
      return decodedUrl;
    },
    findThisData(arr, objKey, fieldValue) {
      return arr.find((obj)=> {
        return this.encodeChineseInUrl(obj[objKey]) === fieldValue;
      });
    },
    apendVideoIcon(data) {
      let dom = document.getElementsByClassName('pswp__item')
      dom = [... dom];
      let domImg = dom[this.clickNum].children[0].children
      domImg = [... domImg]
      let domObj = this.findThisData(data,'src',domImg[0].src)

      if (domObj.videoSrc) {
        let playIcon = {
          type:'div',
          props:{
            class:'playing',
            style: 'transition: background-color 0.3s ease;'
          },
          children:[{
            type:'img',
            props:{
              class:'playImg',
              src: require('../assets/play.png')
            }
          }]
        }
        if (!dom[this.clickNum].querySelector('.playing') && !dom[this.clickNum].querySelector('.video')) {
          dom[this.clickNum].appendChild(this.createElement(playIcon))
          dom[this.clickNum].querySelector('.playImg').addEventListener('click', ()=> {
            let domObj = this.findThisData(data,'src',domImg[0].src)
            this.apendVideoDom(domObj,[... dom[this.clickNum].children[0].children])
            dom[this.clickNum].querySelector('.playing').remove()
          });
        }
      }
    },

    apendVideoDom(nowData,item) {
      let dom = document.getElementsByClassName('pswp__item')
      dom = [... dom];
        item.map((items)=>{
          if (!dom[this.clickNum].children[0].querySelector('.video') && items.width != "1920") {
            let videoNode = {
              type:'video',
              props:{
                class:'video',
                controls: true,
                autoPlay: true,
                src: nowData.videoSrc,
                style: 'width:' + items.width + 'px;height:' + items.height + 'px'
              }
            }
            let node = this.createElement(videoNode)
            dom[this.clickNum].children[0].appendChild(node)
          }
          if (items.tagName != "VIDEO") {
            items.style.display = "none"
          }
        })

    },
    throttle(func, wait,immediate) {
      let timer;

      return function(...args) {
        const context = this;

        if (timer) {
          clearTimeout(timer);
        }

        if (immediate && !timer) {
          func.apply(context, args);
        }

        timer = setTimeout(() => {
          timer = null;
          if (!immediate) {
            func.apply(context, args);
          }
        }, wait);
      };
    },
    /**
     * 父组件调用初始化图片弹出层
     * @param rect 父组件点击图片弹出预览的 rect 使用getBoundingClientRect() 获取
     * @param data 当前需要显示的图片/视频列表  视频需要群在videoImage 的 Base64 图片
     */
    openPhoto(rect,data) {
      let pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

      // 构建 options 结构
      options = {
        showHideOpacity: true,
        cache: 5,
        virtual: true,
        closeOnScroll: false,
        preload: 2,
        getThumbBoundsFn:  (index)=> {
          var  pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        },
      };

      // 获取图片真实宽高 用于预览
      Promise.all(
          data.map(obj => {
            if(/\.(mp4|webm|ogv|mov|avi|wmv|flv)$/i.test(obj.src.split('?')[0])) {
              // 如果为视频，则需要传递videoImg  为视频第一帧
              obj.videoSrc = obj.src
              obj.src  = obj.videoImg
              obj.msrc = obj.src;
            }
            return this.getImageSize(obj.src)
                .then(size => {
                  obj.w = size.width;
                  obj.h = size.height;
                  obj.msrc = obj.src;
                  return obj;
                })
                .catch(error => {
                  console.error(error);
                  return obj;
                });
          })
      ).then(items => {
        // 所有 Promise 已经 resolved，这里可以对 items 进行处理
        items = data
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items,options);

        gallery.init();
        this.gallery = gallery

        this.listenFuc(items)
      });
    },
    listenFuc(items) {
      // 左右箭头click事件监听
      const leftArrow = document.querySelector('.pswp__button--arrow--left');
      const rightArrow = document.querySelector('.pswp__button--arrow--right');

      leftArrow.addEventListener('click', ()=> {
        this.stop();
        this.settransition()
      });

      rightArrow.addEventListener('click', ()=> {
        this.stop();
        this.settransition()
      });

      // 监听移入事件
      leftArrow.addEventListener('mouseover', ()=> {
        this.settransition()
      });

      rightArrow.addEventListener('mouseover', ()=> {
        this.settransition()
      });


      // 监听移出事件
      leftArrow.addEventListener('mouseout', ()=> {
        setTimeout(()=>{
          this.cleartransition()
        },300)
      });

      rightArrow.addEventListener('mouseout', ()=> {
        setTimeout(()=>{
          this.cleartransition()
        },300)
      });


      setTimeout(()=>{
        this.clickNum = 1
        this.apendVideoIcon(items)
      },0)




      this.gallery.listen('preventDragEvent', (e, isDown, PreventObj)=> {
      });


      // 监听 图片切换之后触发 事件
      this.gallery.listen('afterChange', (index)=> {
        this.apendVideoIcon(items)
      });


      // 监听 图片切换之前触发 事件
      this.gallery.listen('beforeChange', (index)=> {
        this.stopVideo()
        if (index < -1) {
          index = 0
        }
        if (index > 1) {
          index = 0
        }
        this.clickNum = this.clickNum + index
        if (this.clickNum > 2) {
          this.clickNum = 0
        }
        if (this.clickNum < 0) {
          this.clickNum = 2
        }
        this.apendVideoIcon(items)

      });

      document.addEventListener('wheel', this.throttle((e)=> {
        if (this.gallery) {
          const delta = e.deltaY; // 滚动的距离（单位：像素）
          this.settransition()
          if (delta > 0) {
            this.gallery.next()
          } else {
            this.gallery.prev()
          }
        }
      },200, true));

      // 监听组件关闭
      this.gallery.listen('close', ()=> {
        // this.gallery.goTo(0)
        this.stopVideo()
        if (this.isPlaying) {
          this.stop();
        }
        this.gallery = null
      });
    }

  },
}
</script>
<style lang="less">
.pswp {
  .playing {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
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
  .pswp__caption {
    z-index: 9999 !important;
  }

}
</style>

<template>
  <!-- 这段html代码，是用来显示图片弹出层的，是由photoswipe提供的 -->
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

      <!-- Container that holds slides.
          PhotoSwipe keeps only 3 of them in the DOM to save memory.
          Don't modify these 3 pswp__item elements, data is added later on. -->
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
          <div style="color:#ffffff;float:right;margin-right:16px;margin-top:14px;cursor: pointer" @click="play">
              <img id="playbutton" src="../assets/play.png" style="width:16px;"/>
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
  data:function () {
    return {
       num:123,
       gallery:null,
       isPlaying:false,
       interval:null,
    }
  },
  methods: {

    //自动播放执行的内容
    autoplay:function() {
      let _self = this;
      _self.gallery.next();
    },

    //停止播放
    stop:function() {
      clearInterval(this.interval);
      this.isPlaying = false;
      this.cleartransition();
      document.getElementById('playbutton').src=require("../assets/play.png");
    },

    //关闭transition
    cleartransition:function () {
      let containers = document.getElementsByClassName("pswp__container");
      let container = containers[0];
      container.style.transition = '';
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

   //判断是否移动端的函数
    isMobileFunc:function() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      if (flag === null) {
        return 0;
      } else {
        return 1;
      }
    },

    /**
     * 父组件调用初始化图片弹出层
     * photoswipe提供的方法，这里没有做任何修改，直接拿来用了
     * @param gallerySelector
     */
    initPhotoSwipeFromDOM:function(gallerySelector) {
      let _self = this;
      // console.log('_self');
      // console.log(_self);
      // parse slide data (url, title, size ...) from DOM elements
      // (children of gallerySelector)
      var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            //divEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // <figure> element

          // include only element nodes
          if (figureEl.nodeType !== 1) {
            continue;
          }

          linkEl = figureEl.children[0]; // <a> element
          //divEl = linkEl.children[0];



          // console.log("linkEl:");
          // console.log(linkEl);

          if(typeof(linkEl)=="undefined"){
            //alert("没有定义");
            //autoAddLine(formId);
            continue;
          }

          size = linkEl.getAttribute('data-size').split('x');
          //
          // console.log("size:w:"+size[0]);
          // console.log("size:h:"+size[1]);

          let w = window.innerWidth;
          let dest_width = w;

           if (size[0] == 10 || size[1] == 10) {
             let imgEl = linkEl.children[0];
             let rect = imgEl.getBoundingClientRect();
             // console.log(rect);

             let dest_height = dest_width * rect.height / rect.width;

             size[0] = dest_width;
             size[1] = dest_height;

           } else {

             let dest_height = dest_width * size[1] / size[0];

             size[0] = dest_width;
             size[1] = dest_height;
           }

          // console.log('w:'+size[0]+";h:"+size[1]);
          item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
          };

          if (figureEl.children.length > 1) {
            // <figcaption> content
            item.title = figureEl.children[1].innerHTML;
          }

          if (linkEl.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkEl.children[0].getAttribute('src');
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }

        return items;
      };

      // find nearest parent element
      var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };

      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
          return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
          //console.log("i:"+i);
          //console.log("nodeType:"+childNodes[i].nodeType);
          //console.log(childNodes[i].nodeName);
          if (childNodes[i].nodeType !== 1) {
            continue;
          }
          if (childNodes[i].nodeName !== 'FIGURE') {
            continue;
          }

          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }


        if (index >= 0) {
          // open PhotoSwipe if valid index found
          //console.log('begin openPhotoSwipe 1');

          //const instance = getCurrentInstance()
          //const _this= instance.appContext.config.globalProperties;
          //console.log('_self:');
          //console.log(_self);
          _self.gallery = openPhotoSwipe(index, clickedGallery);
          //console.log('this gallery');
          //console.log(_self.gallery);

          _self.gallery.listen('destroy', function() {
            if (_self.isPlaying) {
                _self.stop();
            }
            //alert('is destroy');
          });

        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
          return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          var pair = vars[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }

        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }

        return params;
      };

      var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {

        // console.log('openPhotoSwipe');

        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        /*
        *
            getThumbBoundsFn:function(){
                return {x:$self.left,y:$self.top,w:self[0].naturalWidth};
                //动画开始时从对应的图片放大到全屏，返回对应图片相对于窗口的实际坐标和自己的宽度
            },
            maxSpreadZoom:2.5,//手势放大图片最大倍数
            allowPanToNext:true,//图片处于放大状态是否允许滑动到下一张
            getDoubleTapZoom:function(){
                return 1;//双击后图片缩放到的倍数//1表示缩放到原始大小
            },
            loop:false,//滑动到最后一张是否可以继续循环到第一张
            history: false,
            focus: false,
            //closeOnVerticalDrag:false,//垂直拖动图片关闭弹层
            spacing:0.03,
            showAnimationDuration: 430,//显示大图动画时间
            hideAnimationDuration: 430,//隐藏大图动画时间
            showHideOpacity:true,//动画时淡出逐渐变透明
            index: index // 从哪一张图片开始
        * */


        // define options (if needed)
        options = {
          shareButtons: [
            {id:'wechat', label:'分享微信', url:'#'},
            {id:'weibo', label:'新浪微博', url:'#'},
            {id:'download', label:'保存图片', url:'{{raw_image_url}}', download:true}
          ],
          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),
          maxSpreadZoom:2.5,
          getThumbBoundsFn: function (index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect();

            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
          }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        //options.
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        return gallery;
      };

      // loop through all gallery elements and bind events
      var galleryElements = document.querySelectorAll(gallerySelector);

      for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        console.log('begin openPhotoSwipe 2');
        _self.gallery = openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
        //this.gallery = gallery;

        _self.gallery.listen('destroy', function() {
          if (_self.isPlaying) {
            _self.stop();
          }
          //alert('is destroy');
        });

      }
    }
  },
}
</script>

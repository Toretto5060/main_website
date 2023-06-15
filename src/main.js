import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import axios from "./api/resouce";
import flexible from "./utils/flexible.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';



Vue.use(ElementUI);


// import './mock/mock'

Vue.config.productionTip = false;
Vue.prototype.axios = axios;



window.addEventListener('resize', () => {
    // store.state.app.screen_multiple = document.body.clientWidth / 1920
    store.dispatch('app/setScreenMultiple', document.body.clientWidth / 3840)
    // window.history.go(0)
})

store.dispatch('app/setScreenMultiple', document.body.clientWidth / 3840)
// store.state.app.screen_multiple = document.body.clientWidth / 1920


// 设置缩放始终为100%
const keyCodeMap = {
    // 91: true, // command
    61: true,
    107: true, // 数字键盘 +
    109: true, // 数字键盘 -
    173: true, // 火狐 - 号
    187: true, // +
    189: true, // -
};
// 覆盖[ctrl]command + [+]/[-]
document.onkeydown = function (event) {
    //ratio = window.outerWidth / window.innerWidth;
    const e = event || window.event;
    const ctrlKey = e.ctrlKey || e.metaKey;
    if (ctrlKey && keyCodeMap[e.keyCode]) {
        e.preventDefault();
    } else if (e.detail) { // Firefox
        event.returnValue = false;
    }
};

// 覆盖鼠标滚轮
document.addEventListener('wheel', (e) => {
    if (e.ctrlKey|| e.metaKey) {
        // if (e.deltaY < 0) {
        //     document.getElementsByTagName('body')[0].style.zoom=2;
        //     e.preventDefault();
        //     return false;
        // }
        // if (e.deltaY > 0) {
            document.getElementsByTagName('body')[0].style.zoom=1;
            e.preventDefault();
            return false;
        // }
    }
}, { passive: false });

Vue.prototype.fuc = {
    /**
     * formatNumber()
     * 将数值四舍五入后格式化.
     *
     * @param num 数值(Number或者String)
     * @param cent 要保留的小数位(Number)
     * @param isThousand 是否需要千分位 0:不需要, 1:需要(数值类型);
     * @return 格式的字符串,如'1,234,567.45'
     * @type String
     */
    formatNumber(num, cent, isThousand) {
        num = num.toString().replace(/\$|\,/g, "");
        if (isNaN(num)) num = "0";
        var sign = num == (num = Math.abs(num));
        num = parseFloat(num.toFixed(cent));
        num = num.toString();
        var cents;
        if (num.lastIndexOf(".") != -1) {
            let index = num.lastIndexOf(".");
            cents = num.substring(index + 1, num.length);
        } else {
            cents = "";
        }
        num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);
        num = Math.floor(num / Math.pow(10, cent)).toString();
        if (isThousand) {
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + "," + num.substring(num.length - (4 * i + 3));
        }
        if (cent > 0) {
            if (cents == "") {
                return (sign ? "" : "-") + num;
            } else {
                return (sign ? "" : "-") + num + "." + cents;
            }
        } else {
            return (sign ? "" : "-") + num;
        }
    },
    dateFormat(fmt, date) {
        if (!date) {
            return
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "H+": date.getHours(), //小时
            // "h+" :(this.getHours()>12) ? ('下午' + this.getHours() - 12 ): ('上午' + this.getHours()),                   //12小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(h+)/.test(fmt)) {
            // fmt=fmt.replace(RegExp.$1, (this.getHours()>12) ? ('\xa0下午' + this.getHours() - 12 ): ('\xa0上午' + this.getHours()+""));
            fmt = fmt.replace(RegExp.$1, date.getHours() + "");
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    //   toThousands(num) {
    //     return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    //   },
    copyObject(obj1) {　　　　
        var obj2 = {};　　　　
        for (var i in obj1) {　　　　　　 obj2[i] = obj1[i];　　　　 }　　　　
        return obj2;
    },
    //   key_board(keycode,callback) {
    //     document.onkeydown =(e) => {
    //       e = window.event || e;
    //       if(e.keyCode == keycode){
    //         callback()
    //       }
    //     }
    //   }
    deepCopy(obj) {
        let newObj
            // 如果不是数组对象，并且对象存在，直接返回就可以
        if (obj && typeof obj !== 'object') {
            newObj = obj
            return newObj
        }
        var targetObj = obj.constructor === Array ? [] : {}
        for (var keys in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, keys)) {
                if (obj[keys] && typeof obj[keys] === 'object') {
                    targetObj[keys] = obj[keys].constructor === Array ? [] : {}
                    targetObj[keys] = this.deepCopy(obj[keys])
                } else {
                    targetObj[keys] = obj[keys]
                }
            }
        }
        return targetObj
            // return JSON.parse(JSON.stringify(obj));
    },
    getAnnulusOption(tubiao, data, colors, text, subtext, textFontSize, subTextFontSize, textLineHeight) {
        let resultOption = this.deepCopy(tubiao)
        let optionColor = [colors[0], colors[1], colors[2]];
        // optionColor = optionColor.concat(colors)
        resultOption.color = optionColor
        resultOption.title.text = text
        resultOption.title.subtext = subtext
        resultOption.title.textStyle.fontSize = textFontSize
        resultOption.title.textStyle.lineHeight = textLineHeight
        resultOption.title.subtextStyle.fontSize = subTextFontSize
        let firstData = data[0] || 0
        let secondData = data[1] || 0
        resultOption.series[0].data[0].value = 75 * (firstData / secondData);
        resultOption.series[0].data[2].value = 75 * ((secondData - firstData) / secondData);
        return resultOption
    }
}

new Vue({
    router,
    store,
    axios,
    flexible,
    render: h => h(App)
}).$mount("#app");
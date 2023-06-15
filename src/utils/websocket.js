import store from "@/store";

let websock = []
let websockIndex = -1
let messageCallback = null
let errorCallback = null
let wsUrl = ''

// 初始化weosocket
function initWebSocket () {
    if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持WebSocket，无法获取数据')
        return false
    }
    // ws请求完整地址
    const requstWsUrl = wsUrl
    websockIndex ++
    websock[websockIndex] = new WebSocket(requstWsUrl)


  websock[websockIndex].onopen = function () {
    websocketOpen()
  }

  websock[websockIndex].onmessage = function (e) {
    websocketonmessage(e)
  }

  websock[websockIndex].onerror = function (e) {
    console.log('ws连接异常，请稍候重试')
    if (errorCallback) {
      errorCallback(e)
    }
  }
  websock[websockIndex].onclose = function (e) {
    websocketclose(e)
  }
}

// 建立ws连接
function websocketOpen (e) {
  console.log('ws连接成功')
}

// 关闭ws连接
function websocketclose (e) {
  // e.code === 1000  表示正常关闭。 无论为何目的而创建, 该链接都已成功完成任务。
  // e.code !== 1000  表示非正常关闭。
  if (e && e.code !== 1000) {
    if (errorCallback) {
      errorCallback()
    }
  }
}

// 发送消息
function websocketSend (agentData) {
  // 加延迟是为了尽量让ws连接状态变为OPEN   
  setTimeout(() => { 
    // 添加状态判断，当为OPEN时，发送消息
    if (websock[websockIndex].readyState === websock[websockIndex].OPEN) { // websock.OPEN = 1
      // 发给后端的数据需要字符串化
      websock[websockIndex].send(JSON.stringify(agentData))
    }
    if (websock[websockIndex].readyState === websock[websockIndex].CLOSED) { // websock.CLOSED = 3
      console.log('ws连接异常，请稍候重试')
      if (errorCallback) {
        errorCallback()
      }
    }
  }, 500)
}

// 接收ws后端返回的数据
function websocketonmessage (e) {
  if (messageCallback) {
    let arr = JSON.parse(e.data)
    if (arr.api_type) {
      messageCallback(arr)
    }
  }
}

/**
 * 发起websocket请求函数
 * @param {string} url ws连接地址
 * @param {Object} agentData 传给后台的参数
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {function} errCallback ws连接错误的回调函数
 */

function StrtoObj(arg,url) {
  var arr = url.split('?')[1].split('&');
  for (var i = 0; i < arr.length; i++) {
    if (arg == arr[i].split('=')[0]) {
      return arr[i].split('=')[1];
    }
  }
}

var consoleFirst = true

export function init_WebSocket (url, successCallback, errCallback) {
    wsUrl = url
    initWebSocket(successCallback)
    messageCallback = successCallback
    errorCallback = errCallback
  // console.log(websock)
}

export function ws_send (agentData) {
  websocketSend(agentData)
}


export function closeWebsocket (callback) {
    consoleFirst = true
    if (websock.length > 0) {
        websock.map(item=>{
            if (callback) {
                callback(websock)
               return
            }
            if (item.readyState != 3) {
                item.close()
                if (consoleFirst) {
                    console.log('已关闭-' + StrtoObj('api_type', websock[websockIndex].url) + '链接')
                    consoleFirst = false
                }
            }
        })
    }
}
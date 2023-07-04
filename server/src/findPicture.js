const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ExifReader = require('exifreader');

const { ExiftoolProcess } = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const exiftool = new ExiftoolProcess(exiftoolBin);

const sendMessage = require('./send_gotify');
const setting = require('../setting');


/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */

Date.prototype.format = function(fmt) {
    var weekArray = new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        // "h+" :(this.getHours()>12) ? ('下午' + this.getHours() - 12 ): ('上午' + this.getHours()),                   //12小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds(), //毫秒
        "W": weekArray[this.getDay()]
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(h+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getHours() > 12) ? ('\xa0下午' + (this.getHours() - 12)) : ('\xa0上午' + (this.getHours()) + ""));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function formatPosition(str) {
    let numList = str.match(/(\d+(\.\d+)?)/g);
    let dd = parseFloat(numList[0]) + (parseFloat(numList[1]) / 60) + (parseFloat(numList[2]) / 3600);
    if (str.indexOf('S') > -1  || str.indexOf('W') > -1) {
        dd = -dd;
    }
    return dd;
}


// 图片拍摄日期获取
async function processExifData(filePath,callback) {
    try {
        const tags = await ExifReader.load(filePath, { expanded: true });
        let obj = {
            date: '',
            location: null
        }

        if (tags.gps) {
            obj.location = tags.gps
        }
        if (tags.exif && tags.exif['DateTime']) {
            const dateString = tags.exif['DateTime'].value[0].split(' ');
            const replacedDateStr = dateString[0].replace(/:/g, '-')
            obj.date = replacedDateStr + ' ' + dateString[1]
        } else {
            obj.date = getImageCreateTime(filePath)
        }
        if (callback) {
            callback(obj)
        }
    } catch (error) {
        console.error('Error processing EXIF data:', error);
    }
}


// 视频拍摄日期获取
async function getVideoCaptureDate(videoPath,callback) {
    try {
        await exiftool.open();
        if (exiftool.isOpen) {
            // 读取图片的元数据
            const metadata = await exiftool.readMetadata(videoPath);
            if (callback) {
                let obj = {
                    date: '',
                    location: null
                }

                if (metadata.data[0] &&  metadata.data[0].GPSPosition) {
                    let position = {
                        Latitude: formatPosition(metadata.data[0].GPSLatitude),
                        Longitude:formatPosition(metadata.data[0].GPSLongitude)
                    }
                    obj.location = position
                }
                if (metadata.data[0] && metadata.data[0].CreateDate) {
                    const dateString = metadata.data[0].CreateDate.split(' ');
                    const replacedDateStr = dateString[0].replace(/:/g, '-')
                    // 与实际创建时间小8小时
                    let dateTime =(new Date(replacedDateStr + ' ' + dateString[1]).getTime()) + (60 * 60 * 8 * 1000)
                    obj.date = new Date(dateTime).format('yyyy-MM-dd HH:mm:ss')
                }
                callback(obj)
            }
            // 关闭 Exiftool 进程
            if(exiftool.isOpen) {
                exiftool.close();
            }
        } else {
            throw new Error('Exiftool进程未能成功打开！');
        }
    } catch (error) {
        console.error(error);
    }
}


function fileDisplay(folderPath, fileList) {
    if (!fileList) {
        fileList = [];
    }
    const files = fs.readdirSync(folderPath);

    const promises = files.map((filename) => {
        const filePath = path.join(folderPath, filename);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && filename !== '@eaDir') {
            // 是目录，继续遍历子文件夹
            return fileDisplay(filePath, fileList);
        } else
        if (stat.isFile() && setting.reg.test(filePath)) {
            // 是文件且扩展名为图片格式，将其添加到 fileList 中
            let obj = {
                src: (setting.linkFolder + filePath.split(setting.filePath)[1]).replace(/\\/g, '/'),
                sourceSrc: (setting.linkFolder + filePath.split(setting.filePath)[1]).replace(/\\/g, '/'),
                date: getImageCreateTime(filePath),
                location: null
            };
            // 获取图片源创建时间及gps信息
            if (/\.(jpg|jpeg|png|heic|heif|webp)$/.test(filePath)) {
                return new Promise((resolve, reject) => {
                    processExifData(filePath, (tags) => {
                        obj.date = tags.date;
                        obj.location = tags.location;

                        // 将图片源文件压缩到新文件夹。app.js中设置新文件夹以服务方式访问
                        if (/\.(jpg|jpeg|png)$/.test(filePath)) {
                            sharp(filePath)
                                .jpeg({ quality: 80, progressive: true })
                                .gamma(2)
                                .toFile(setting.currentPath + '/public/' + (filePath.split(setting.filePath)[1].replace(/\\/g, '/')).match(/\/([^/]+)$/)[1], (err, info) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        obj.src = setting.linkFolder.replace('sourcePublic', 'public') + '/' + (filePath.split(setting.filePath)[1].replace(/\\/g, '/')).match(/\/([^/]+)$/)[1];
                                        fileList.push(obj); // 将obj添加到fileList数组中
                                        resolve(obj);
                                    }
                                });
                        }  else {
                            fileList.push(obj);
                            resolve(obj);
                        }
                    });
                });
            }
            // 获取视频源创建时间及gps信息
            else if(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/.test(filePath)) {
                return new Promise((resolve, reject) => {
                    getVideoCaptureDate(filePath,(tags)=>{
                        obj.date = tags.date;
                        obj.location = tags.location;
                        fileList.push(obj);
                        resolve(obj);
                    })
                })
            } else {
                fileList.push(obj);
            }
        }
    });
    return Promise.all(promises).then(() => fileList);
}

/**
 * 获取图片创建时间（拍摄时间）
 * @param filePath 需要获取时间的图片
 */
function getImageCreateTime(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const birthtime = stats.birthtime;
        return new Date(birthtime).format('yyyy-MM-dd HH:mm:ss')
    } catch (err) {
        console.error(err);
        return null;
    }
}


/**
 *  初次运行将遍历的文件夹数据保存在/storage/pictrueList.json中
 *  监听文件夹变动
 *  若文件夹发生数据变动，则重新遍历文件夹，否则则使用/storage/pictrueList.json 中数据
 */
let protData;
const chokidar = require('chokidar');


// 监听文件夹变动
function watchFolderChanges(callback) {
    const watcher = chokidar.watch(setting.currentPath + '/sourcePublic', {
        ignored: /^.*[\\\/]@[^\\\/]*$/, // 忽略以点开头的文件和文件夹
        persistent: true
    });
    let isReady = false; // 判断是否已经初始化完毕
    watcher
    .on('ready', () => {
        isReady = true;
    })
    .on('add', (filePath) => {
        if (!isReady) return; // 过滤掉初始加载阶段的文件
        if (callback) {
            callback(filePath)
        }
    })
    .on('change', (filePath) => {
        if (callback) {
            callback(filePath)
        }
    })
    .on('unlink', (filePath) => {
        if (callback) {
            callback(filePath)
        }
    });
}


fileDisplay(setting.filePath)
.then((result) => {
    protData = result;
    fs.writeFile(setting.currentPath + '/storage/pictrueList.json', JSON.stringify(protData), (err) => {
        if (err) throw err;
        console.log('Data has been written to file');
    });
    let lastSendMessageTime = 0;

    // 监听文件夹变动 (部分ndoe平台不支持fs watch，下方每秒定时遍历查看)
    if (setting.fsWatch) {
        fs.watch(setting.filePath, { recursive: true }, (eventType, filename) => {
            fileDisplay(setting.filePath)
            .then((result) => {
                protData = result;
                fs.writeFile( setting.currentPath +'/storage/pictrueList.json', JSON.stringify(protData), (err) => {
                    if (err) throw err;
                });
                module.exports = protData
                if (eventType != "change") {
                    const now = new Date().getTime();
                    if (now - lastSendMessageTime >= 10 * 60 * 1000) {
                        // 如果距离上一次发送消息已经过去了10分钟，则发送消息并更新时间戳
                        sendMessage.send({
                            title: '数据变动',
                            message: setting.filePath.replace(/\\/g, '/') + '下数据发生变动，请注意！'
                        })
                        lastSendMessageTime = now;
                    }
                }
            })
        });
    }
    else {
        watchFolderChanges((file)=>{
            fileDisplay(setting.filePath)
            .then((result) => {
                protData = result
                fs.writeFile( setting.currentPath +'/storage/pictrueList.json', JSON.stringify(protData), (err) => {
                    if (err) throw err;
                });
                module.exports = protData
                const now = new Date().getTime();
                if (now - lastSendMessageTime >= 10 * 60 * 1000) {
                    // 如果距离上一次发送消息已经过去了10分钟，则发送消息并更新时间戳
                    sendMessage.send({
                        title: '数据变动',
                        message: setting.filePath.replace(/\\/g, '/') + '下数据发生变动，请注意！'
                    })
                    lastSendMessageTime = now;
                }
            })
        });
    }

    // 读取文件夹数据
    fs.readFile( setting.currentPath +'/storage/pictrueList.json', (err, data) => {
        if (err)  {
            let listData = fileDisplay(setting.filePath);
            fs.writeFile( setting.currentPath + '/storage/pictrueList.json', JSON.stringify(listData), (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            protData = listData
        } else {
            protData = JSON.parse(data.toString())
        }
        module.exports = protData
    });

})
.catch((error) => {
    console.error(error);
});







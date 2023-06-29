const fs = require('fs');
const path = require('path');
const moment = require('moment');   // nodejs时间格式化
const setting = require('../setting');
const ExifParser = require('exif-parser');
const sendMessage = require('./send_gotify');


const sharp = require('sharp');

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */



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
        } else if (stat.isFile() && setting.reg.test(filePath)) {
            // 是文件且扩展名为图片格式，将其添加到 fileList 中
            let obj = {
                src: (setting.linkFolder + filePath.split(setting.filePath)[1]).replace(/\\/g, '/'),
                sourceSrc: (setting.linkFolder + filePath.split(setting.filePath)[1]).replace(/\\/g, '/'),
                date: moment(getImageCreateTime(filePath)).format('YYYY-MM-DD HH:mm:ss'),
                location: ""
            };
            // 读取图片源文件创建时间
            if (/\.(jpg|jpeg)$/.test(filePath)) {  // 图片
                // 读取文件并解析 EXIF 数据
                const buffer = fs.readFileSync(filePath);
                const parser = ExifParser.create(buffer);
                const result = parser.parse();
                // 获取图片拍摄地点信息

                if (result.tags && Object.keys(result.tags).length > 0) {
                    obj.location = result.tags.GPSLatitude ? (result.tags.GPSLatitude + ',' + result.tags.GPSLongitude) : "";
                    if (result.tags.DateTimeOriginal) {
                        obj.date = moment(result.tags.DateTimeOriginal * 1000).format('YYYY-MM-DD HH:mm:ss');
                    }
                } else {
                    obj.location = '';
                }
            }

            // 将图片源文件压缩到新文件夹。app.js中设置新文件夹以服务方式访问
            if (/\.(jpg|jpeg|png)$/.test(filePath)) {
                return new Promise((resolve, reject) => {
                    sharp(filePath)
                        .gamma(3)
                        // 保存处理后的图像
                        .toFile(setting.currentPath + '/public/' + (filePath.split(setting.filePath)[1].replace(/\\/g, '/')).match(/\/([^/]+)$/)[1], (err, info) => {
                            if (err) {
                                fileList.push(obj);
                                reject(err);
                            } else {
                                obj.src = setting.linkFolder.replace('sourcePublic', 'public') + '/' + (filePath.split(setting.filePath)[1].replace(/\\/g, '/')).match(/\/([^/]+)$/)[1];
                                fileList.push(obj);
                                resolve();
                            }
                        });
                });
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
        return stats.birthtime; // 获取文件创建时间
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


// 用于存储上一次读取到的文件列表
let previousFileList = [];
function watchDirectory(callback) {
    fs.readdir(setting.filePath, (err, files) => {
        if (err) {
            console.error(`无法读取目录：${err}`);
            return;
        }

        // 检查新文件
        files.forEach(file => {
            if (!previousFileList.includes(file)) {
                if (previousFileList.length > 0 && callback) {
                    callback();
                }
            }
        });

        // 检查被删除的文件
        previousFileList.forEach(prevFile => {
            if (!files.includes(prevFile)) {
                if (previousFileList.length > 0 && callback) {
                    callback();
                }
            }
        });

        // 更新上一次的文件列表
        previousFileList = files;

        // 继续定时监控
        setTimeout(() => watchDirectory(callback), 1000); // 每秒钟检查一次
    });
}


fileDisplay(setting.filePath)
    .then((result) => {
        protData = result;

        fs.writeFile( setting.currentPath + '/storage/pictrueList.json', JSON.stringify(protData), (err) => {
            if (err) throw err;
            console.log('Data has been written to file');
        });
        let lastSendMessageTime = 0;

        // 监听文件夹变动 (部分ndoe平台不支持fs watch，下方每秒定时遍历查看)
        if (setting.fsWatch) {
            fs.watch(setting.filePath, { recursive: true }, (eventType, filename) => {
                protData = fileDisplay(setting.filePath);
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
            });
        } else {
            watchDirectory(()=>{
                protData = fileDisplay(setting.filePath);
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







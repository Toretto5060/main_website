const fs = require('fs');
const path = require('path');
const moment = require('moment');   // nodejs时间格式化
const setting = require('../setting');
const ExifParser = require('exif-parser');

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(folderPath, fileList) {
    if (!fileList) {
        fileList = [];
    }
    const files = fs.readdirSync(folderPath);
    files.forEach((filename) => {
        const filePath = path.join(folderPath, filename);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            // 是目录，继续遍历子文件夹
            fileDisplay(filePath, fileList);
        } else if (stat.isFile() && setting.reg.test(filePath)) {
            // 是文件且扩展名为图片格式，将其添加到 fileList 中
            let obj = {
                src: (setting.linkFolder + filePath.split(setting.filePath)[1]).replace(/\\/g, '/'),
                date: moment(getImageCreateTime(filePath)).format('YYYY-MM-DD HH:mm:ss'),
                location: ""
            }
            if (/\.(jpg|jpeg)$/.test(filePath)) {  // 图片
                // 读取文件并解析 EXIF 数据
                const buffer = fs.readFileSync(filePath);
                const parser = ExifParser.create(buffer);
                const result = parser.parse();
                // 获取图片拍摄地点信息
                // console.log(result)
                if (result.tags && Object.keys(result.tags).length > 0) {
                    obj.location = `${result.tags.GPSLatitude},${result.tags.GPSLongitude}`
                    if (result.tags.DateTimeOriginal) {
                        obj.date = moment(result.tags.DateTimeOriginal * 1000).format('YYYY-MM-DD HH:mm:ss');
                    }
                } else {
                    obj.location = ''
                    // console.log('No location data found');
                }
            }
            fileList.push(obj);
        }
    });
    return fileList;
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

let protData = fileDisplay(setting.filePath)

fs.writeFile('./storage/pictrueList.json', JSON.stringify(protData), (err) => {
    if (err) throw err;
    console.log('Data has been written to file');
});

// 监听文件夹变动
fs.watch(setting.filePath, { recursive: true }, (eventType, filename) => {
    protData = fileDisplay(setting.filePath);
    fs.writeFile('./storage/pictrueList.json', JSON.stringify(protData), (err) => {
        if (err) throw err;
        console.log('Data has been written to file');
    });
    module.exports = protData
});

// 读取文件夹数据
fs.readFile('./storage/pictrueList.json', (err, data) => {
    if (err)  {
        let listData = fileDisplay(setting.filePath);
        fs.writeFile('./storage/pictrueList.json', JSON.stringify(listData), (err) => {
            if (err) throw err;
            console.log('Data has been written to file');
        });
        protData = listData
    } else {
        protData = JSON.parse(data.toString())
    }
    module.exports = protData
});





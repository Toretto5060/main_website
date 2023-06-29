const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const setting = require('./setting');

// 各板块api
const indexApi = require('./api/indexApi');

// 使用 fs 模块的 realpath 方法获取当前路径
fs.realpath(__dirname, (err, currentPath) => {
    if (err) {
        // console.error(err);
        return;
    }
    setting.currentPath = currentPath.replace(/\\/g, '/')
    const pictureList = require('./src/findPicture');



    // 采用设置所有均可访问的方法解决跨域问题
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'content-type');
        res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');

        if (req.method.toLowerCase() === 'options') {
            res.send(200); // 让options尝试请求快速结束
        } else {
            next();
        }
    });

    const stats = fs.lstatSync(setting.currentPath + '/sourcePublic');
    if (!stats.isSymbolicLink()) { // 软链不存在
        // 创建软链
        fs.symlink(setting.filePath, setting.currentPath + '/sourcePublic', 'dir', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Soft link created successfully!');
            }
        });
    }

    // 将源文件夹以服务的方式访问
    app.use(setting.linkFolder,express.static(path.join(__dirname, 'sourcePublic')));


    // 将压缩文件夹以服务的方式访问
    app.use(setting.linkFolder.replace('sourcePublic','public'),express.static(path.join(__dirname, 'public')));





    app.use(bodyParser.json()); // 以json格式返回出去
    app.use(bodyParser.urlencoded({ extended: false }));

// 后端api路由
    app.use('/lybaby/index', indexApi);



// 监听端口
    const server = app.listen(setting.port, () => {
        console.log(`success listen at port:${setting.port}......`);
    });

// 监听服务关闭后，取消软链
    process.on('SIGINT', () => {
        console.log('Closing the server...');
        server.close(() => {
            fs.unlink('public', (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Soft link removed successfully!');
                }
            });
        });
        process.exit(0);
    });





});
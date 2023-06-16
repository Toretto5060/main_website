const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const setting = require('./setting');
// 各板块api
const indexApi = require('./api/indexApi');
const pictureList = require('./src/findPicture');

// 创建软链
fs.symlink(setting.filePath, 'public', 'dir', (err) => {
    if (err) {
        // console.error(err);
    } else {
        console.log('Soft link created successfully!');
    }
});

// 将此文件夹以服务的方式访问
app.use(setting.linkFolder,express.static(path.join(__dirname, 'public')));


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


app.use(bodyParser.json()); // 以json格式返回出去
app.use(bodyParser.urlencoded({ extended: false }));

// 后端api路由
app.use('/api/index', indexApi);



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

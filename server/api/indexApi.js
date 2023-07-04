const express = require('express');
const router = express.Router();
const publicFuc = require('../utils/pubilc');
const setting = require('../setting');


router.post('/age/login', (req, res) => {
    let obj = {
        code: -10000,
        data:{},
        message:'api出错!'
    }
    if (req.body && req.body.password) {
        if (req.body.password == setting.loginKey) {
            obj.code = 200
            obj.data.token = publicFuc.issueToken(req.query,'lybabyApi','1h')
            obj.message = '口令正确，放行'
            res.status(200).send(obj);
        } else {
            obj.code = -1
            obj.data = ''
            obj.message = "口令错误!"
            res.status(401).send(obj);
        }
    } else {
        obj.code = -100
        obj.data = ''
        obj.message = "缺少password参数！"
        res.status(400).send(obj);
    }
});

router.post('/age/getPicture', (req, res) => {
    const pictureList = require('../src/findPicture');
    let newList = null

    pictureList.map(item=>{
        item.title= publicFuc.age(item.date,setting.formatDate)
    })
    newList = Object.values(publicFuc.groupByDateType(pictureList,'title'));
    newList = publicFuc.sortObjectsByDate(newList,'title')
    let sendObj = null
    if (pictureList.length > 0) {
        sendObj = {
            code: 200,
            data: newList,
            message: 'success'
        }
    } else {
        sendObj = {
            code: -10000,
            data: [],
            message: 'error'
        }
    }
    res.send(sendObj);
});

module.exports = router;
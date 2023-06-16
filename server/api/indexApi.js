const express = require('express');
const router = express.Router();
const publicFuc = require('../utils/pubilc');



// const setting = require('../setting');

//
router.get('/getPicture', (req, res) => {
    const pictureList = require('../src/findPicture');
    let newList = null
    pictureList.map(item=>{
        item.dateType= publicFuc.age(item.date)
    })
    newList = Object.values(publicFuc.groupByDateType(pictureList,'dateType'));
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
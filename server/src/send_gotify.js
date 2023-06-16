const http = require('http');
const https = require('https');
const setting = require('../setting');

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};

function send (postData) {
    if (!postData || !setting.gotify_url || setting.gotify_url == "" || !setting.gotify_token || setting.gotify_token == "") {
        return '参数校验不正确'
    }
    postData = JSON.stringify(postData);
    const httpsRegex = /^https:\/\//i;
    let moduleType = http
    if (httpsRegex.test(setting.gotify_url)) {
        moduleType = https
    }
    const req = moduleType.request(setting.gotify_url + '/message?token=' + setting.gotify_token , options, (res) => {
        if (res.statusCode == 200) {
            res.on('data', (chunk) => {
                console.log(chunk.toString());
                return chunk.toString()
            });
        }
    });
    req.on('error', (error) => {
        console.error(error);
    });
    req.write(postData);
    req.end();
}

module.exports = { send };
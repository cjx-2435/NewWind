//app.js
import mqtt from '/lib/mqtt.min.js';
const hostUrl = 'wxs://zhipu-china.com:8084/mqtt';
const clientId = getuuid();
//随机生成uuid
function getuuid() {
    const withLine = true; //带不带横线
    const len = 36; //长度为36
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    let radix = 16 || chars.length;//16进制
    if (withLine) {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < len; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    } else {
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }
    }
    console.log(uuid.join(''));
    return uuid.join('');
}
//连接配置
const options = {
    protocolVersion: 4, //MQTT连接协议版本
    connectTimeout: 4000,  //超时时间
    clientId: clientId,  //随机生成uuid
    username: 'freshAirMobileClient',  //用户名
    password: 'cpXFMob5927889',  //密码
}

App({
    //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
    onLaunch: function(options) {
        wx.cloud.init({
            env:"newwind-4gmn4xj350361752",
            traceUser: true
        }) 
    },
    globalData: {
        client_ID: clientId,
        client: mqtt.connect(hostUrl, options),
    },
    onShow: function(options) {

    },
    onHide: function() {

    },
    onError: function(msg) {

    },
    //options(path,query,isEntryPage)
    onPageNotFound: function(options) {

    },
    /*globalData: {
        
    }*/
});
  
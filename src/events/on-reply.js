/**
 * @author Srecko
 * @desc: 回复消息
 * @date 2021-12-1
 */
const { UrlLink } = require('wechaty');
const { FileBox } = require('wechaty');
const bot = require('../../index'); // 获取微信实例
const commonInfoUrl = require('./common'); 
const rootListArr = [ "YHL.", "Srecko."] 
// const commonInfoUrl = {
//     description : '这里是百度首页',
//     thumbnailUrl: 'http://emoji.qpic.cn/wx_emoji/EruiaYDEOxicicgMuu3JTSdO969XcgkZGZVu2OPJ0sucRvDautUOHlt66ezlVPFSAES/',
//     tltle       : '请求',
//     url         : 'www.baidu.com',
// }
const onReply = (message) => {
    if (message.self()) return;
    onMessageInit(message);
};

/**
 * @Description 初始化消息方法
 */
 async function onMessageInit(message) {
    console.log(message)
    await onReplyMessage(message);
}
async function onReplyMessage(message) {
    console.log(message)
    const room = message.room();
    const from = message.from();
    const topic = await room.topic();
    const text = message.text();
    console.log(room)
    console.log(from)
    console.log(topic)

    if (room !== null && from.id === 'menghuanlijiahui'){
        if(/好好/.test(text)){
            const fileBox = FileBox.fromUrl('http://ljh.yangdagang.com/pictures/31917159167644455b2656f72aed451e.mp4');
            // room.say(new UrlLink(commonInfoUrl))
            console.log(fileBox)
            room.say(fileBox)
        }
    }
}
module.exports = onReply;

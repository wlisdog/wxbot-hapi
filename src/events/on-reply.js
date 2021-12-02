/**
 * @author Srecko
 * @desc: 回复消息
 * @date 2021-12-1
 */
import {
    UrlLink,
    FileBox
} from 'wechaty';
import bot  from '../../index.js'; // 获取微信实例
import commonInfoUrl  from './common.js'; 
import test from './testMySQL.js';
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

    if (room !== null && from.id === 'menghuanlijiahui'){
        if(/好好/.test(text)){
            const fileBox = FileBox.fromUrl('http://ljh.yangdagang.com/pictures/31917159167644455b2656f72aed451e.mp4');
            // room.say(new UrlLink(commonInfoUrl))
            console.log(fileBox)
            
            const s = await test();
            console.log('这里是开始')
            const j = JSON.stringify(s)
            console.log('调用到这里了')
            room.say(fileBox)
        }
        if(/图片/.test(text)){
            const s = await test();
            console.log('这里是开始')
            const aaa = s[0].MediaId
            const timestamp = s[0].MediaId
            console.log(s[0])
            console.log(aaa)
            console.log(timestamp)
            console.log('调用到这里了')
            const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${timestamp}.jpg`);
            room.say(fileBox)
        }
    }
}
export default onReply;

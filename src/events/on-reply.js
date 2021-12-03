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

const onReply = (message) => {
    if (message.self()) return;
    onMessageInit(message);
};

/**
 * @Description 初始化消息方法
 */
 async function onMessageInit(message) {
    let room = message.room();
    await onReplyMessage(message);
    if (!room) {
        return;
    }
}

/**
 * @Description 发送消息
 */
async function onReplyMessage(message) {
    const room = message.room();
    const text = message.text();

    if (room !== null ){
        if(/好/.test(text)){
            room.say(new UrlLink(commonInfoUrl))
        }
        if(/谁/.test(text)){
            room.say('你好啊~')
        }
        if(/图/.test(text)){
            const messageJson = await test();
            const mediaId = messageJson[0].MediaId
            const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.jpg`);
            room.say(fileBox)
        }
        if (/名片/.test(text)) { 
            const contactCard = await bot.bot.Contact.find({name: 'Srecko.'}) 
            if (!contactCard) {
                 console.log('not found') 
                return 
            } 
            await room.say(contactCard) 
        }
    }
}
export default onReply;

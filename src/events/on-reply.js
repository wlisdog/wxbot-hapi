/**
 * @author Srecko
 * @desc: 回复消息
 * @date 2021-12-1
 */
import {
    UrlLink,
    FileBox,
    Room
} from 'wechaty';
import dayjs from 'dayjs';
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
            const messageJson = await test();
            room.say(new UrlLink(commonInfoUrl))
        }
        if(/天气/.test(text)){
            const sql = `select Content from weatherInfo where CityName = '北京' and Create_Date = '2021-12-10'`;
            const weatherJson = await test(sql);
            const Content = weatherJson[0].Content
            room.say(Content) 
        }
        if(/日期/.test(text)){
            console.log(dayjs().format('YYYY-MM-DD')) 
            room.say(dayjs().format('YYYY-MM-DD'))
        }
        if(/图/.test(text)){
            const sql = 'select MediaId from imagemessage order by rand() limit 1';
            const messageJson = await test(sql);
            const mediaId = messageJson[0].MediaId
            console.log(mediaId)
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

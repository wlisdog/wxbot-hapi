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
import {sleep} from './sleepThread.js';
import bot  from '../../index.js'; // 获取微信实例
import commonInfoUrl  from './common.js'; 
import query from './testMySQL.js';
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
        if(/天气/.test(text)){
            let cityname = '北京';
            let date = dayjs().format('YYYY-MM-DD')

            const sql = `select Content from weatherInfo where CityName = '${cityname}' and Create_Date = '${date}'`;
            const weatherJson = await query(sql);
            const Content = weatherJson[0].Content
            room.say(Content)
            await sleep(1000);   //暂停1秒
            room.say('目前只能查询北京当天凌晨6点左右天气情况，无法查询实时天气，相关接口正在进行中，如有疑问请联系以下人员')
            await sleep(1000);   //暂停1秒
            const contactCard = await bot.bot.Contact.find({name: 'Srecko.'}) 
            if (!contactCard) {
                 console.log('not found') 
                return 
            } 
            await room.say(contactCard) 
        }
        if(/时间/.test(text)){
            console.log(dayjs().format('YYYY-MM-DD HH:mm:ss')) 
            room.say(dayjs().format('YYYY-MM-DD HH:mm:ss'))
        }
        if(/图/.test(text)){
            const sql = 'select MediaId from imagemessage order by rand() limit 1';
            const messageJson = await query(sql);
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

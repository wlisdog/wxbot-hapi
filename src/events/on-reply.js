/**
 * @author Srecko
 * @desc: 回复消息(群聊)
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
import {getWeather,getImage,getTimer} from './webServiceLink.js';
import query from './testMySQL.js';
import {onToPublicmethodReminded } from "../plugins/schedule/index.js";

const rootListArr = [ "YHL.", "S"] 

const onReply = (message) => {
    
    if (message.self()) return;
    onMessageInit(message);
};

/**
 * @Description 初始化消息方法
 */
 async function onMessageInit(message) {
    let room = message.room();
    
    // 不是群消息直接返回
    if (!room) {
        return;
    }
    // 目前先对关键字全部功能放行，限制表情包
    await onReplyMessage(message);

    // 判断机器人回复功能是否开启
    const id = room.id
    const contact = message.talker().name()
    const purviewsql = "select totalpurview from roompurview where roomid = '"+id+"'";
    const totalpurviewJson = await query(purviewsql);
    let totalpurview
    if(!totalpurviewJson.length == 0){
        totalpurview = totalpurviewJson[0].totalpurview
    }else{
        totalpurview = 'N'
    }
    
    // 不是超级权限者并且没有配置群权限直接返回
    if(!rootListArr.includes(contact) && totalpurview == 'N'){
        return;
    }
    await onEmojiToImage(message);
}

/**
 * @Description 发送消息
 */
async function onReplyMessage(message) {
    const room = message.room();
    const text = message.text();

    if (room !== null ){
        if(/当前时间/.test(text)){
            console.log(dayjs().format('YYYY-MM-DD HH:mm:ss SSS')) 
            room.say(dayjs().format('YYYY-MM-DD HH:mm:ss'))
        }
        if(/随机图片/.test(text)){
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
        if(/天气/.test(text)){
            const city = text.substring(0, text.length - 2);
            console.log(city)
            const weatherMessage = await getWeather(city);
            const weatherInfo = eval('/'+city+'/')
            if(weatherInfo.test(weatherMessage.return)){
                room.say(weatherMessage.return) 
            }else{
                room.say('未查到需要的天气记录，天气查询格式应为: XX天气    XX为所查询的城市名称')
            }
            
        }
         if(/原神角色/.test(text)){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a1.jpg`);
            room.say(role1) 
            await sleep(1000);
            const role2 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a2.jpg`);
            room.say(role2) 
            await sleep(1000);
            const role3 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a3.jpg`);
            room.say(role3) 
         }
         if(/原神材料/.test(text)){
            room.say(new UrlLink(commonInfoUrl))
         }
         if(/定时任务/.test(text)){
            await room.sync()
            const contact3 = message.talker().name()
            const id = room.id

            const content = contact3 + '|' + id + '|' +text
            console.log(content)
            const timestamp = await getTimer(content); 
            
            await onToPublicmethodReminded(timestamp.return);
            const members = await room.member({name: contact3}) 
            room.say('您的定时任务已经配置成功',members)
         }
         if(/房间id/.test(text)){
            const id = room.id
            console.log(id)
            const topic = await room.topic()
            console.log(`room topic is : ${topic}`)
            room.say(id)
            await sleep(1000);
            room.say(`${topic}`)
         }


         // 当需要测试时再打开
         if(/测试/.test(text)){

            // const room6 = await bot.bot.Room.find('朵朵1');
  
            // console.log(room6)

            // if(room6){
            //     await room6.say('进入这里');
            // }
            // console.log('结束')
         }
    }   
}


/**
 * 表情包转换图片路径
 * @param message {Class} 消息实例
 * 
 */
 async function onEmojiToImage(message) {
    let return_text = message.text().replace(/\s/g,"").replace(/&amp;/g, "&");
    let url;
    if (return_text.indexOf('emoji') > -1 ) {
        url = return_text.split('cdnurl=')[1].split('designerid')[0];
        url = url.substring(1, url.length - 1);
        await message.say('正在转换表情包，请稍候(目前预览仅支持静态表情包，动态表情包如需预览保存请点击链接)');
        const fileName = await getImage(url);
        
        await sleep(1000);   //暂停1秒
        const mediaId = fileName.return
        const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
        const fileUrl = 'http://ljh.yangdagang.com/pictures/'+mediaId+'.gif';
        await message.say(fileBox);
        await sleep(1000);   //暂停1秒
        await message.say(fileUrl);
        
    }
}
export default onReply;
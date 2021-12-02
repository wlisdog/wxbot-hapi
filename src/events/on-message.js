// import request from "request";
// import fs from "fs";
// import path from 'path';
// const dir = path.join(__dirname + '/../images');
// import { FileBox } from 'file-box';
import bot from '../../index.js'; // 获取微信实例
import {
    FileBox,
} from 'wechaty';

let isRoomComeAndGoFlag = false; // 是否开启群聊踢人操作。 后期改为数据库存储
let isEmojiToImageFlag = false; // 是否开启表情包转图片功能。 后期改为数据库存储
let timer = null
let isMyGrilTalkFlag = false
const rootListArr = [ "YHL.", "Srecko."] // 白名单 后期改为接口形式
const onMessage = (message) => {
    if (message.self()) return;
    onMessageInit(message);
};


/**
 * 初始化消息方法
 * @param message {Class} 消息实例
 */
async function onMessageInit(message) {
    await onRoomComeAndGo(message);
    // await onMyGirlMessage(message);
    await onEmojiToImageFlag(message);
    await onEmojiToImage(message);
    // await onFunctionList(message);
}

/**
 * 功能列表回复 - 后期改为接口形式
 * @param message {Class} 消息实例
 */
async function onFunctionList(message) {
    const name = message.talker().name();
    // 判断是否为有权限用户
    if (rootListArr.includes(name) && message.text() === '功能列表') {
        message.say(`
            1. 微信群拉人踢人骂人一体化。
            2. 表情包转图片。
            3. 定时任务消息。
            4. 昆哥语录(待开发)。
        `)
    }
}

/**
 * 表情包转换图片开关
 * @param message {Class} 消息实例
 */
async function onEmojiToImageFlag(message) {
    const name = message.talker().name();
    // 判断是否为有权限用户
    if (rootListArr.includes(name) && message.text() === '开启表情包转换') {
        isEmojiToImageFlag = true
        message.say(`开启表情包转换成功~`)
    }
    if (rootListArr.includes(name) && message.text() === '关闭表情包转换') {
        isEmojiToImageFlag = false
        message.say(`关闭表情包转换成功~`)
    }
}

/**
 * 王总回话
 * @param message {Class} 消息实例
 */
async function onMyGirlMessage(message) {
    const name = message.talker().name();
    const contact = await bot.bot.Contact.find({name: 'YHL.'});
    if (name === '小抽基') {
        if (!isMyGrilTalkFlag) {
            message.say('好的领导，已帮您通知部门小杨, 领导路上注意安全')
        } else {
            message.say('好的呢，领导说的都对')
        }
        contact.say(`领导发话${message.text()}`)
        isMyGrilTalkFlag = true
    }
}

/**
 * 群聊土遁-进进出出
 * @param message {Class} 消息实例
 */

async function onRoomComeAndGo(message) {
    let room = message.room();
    // console.log(message)
    const name = message.talker().name();
    if (!room) {
        return;
    }
    onRoomListionComeAndGo({
        room,
        name,
        topic: '11111',
        startText: '开始',
        endText: '好了好了',
        userName: '杨大刚',
        endSay: ['over'],
        addSay: ['欢迎欢迎'],
        duration: 5000
    }, message);
}

/**
 * 群聊踢人拉人喷人
 * @param message {Class} 消息实例
 * @param data {Object} 监听参数对象
 * @param   room {Class} 群聊房间实例
 * @param   name {String} 发送消息人昵称
 * @param   topic {String} 监听群聊名称匹配
 * @param   startText {String} 开始口令
 * @param   endText {String} 结束口令
 * @param   userName {String} 被操作人的微信昵称
 * @param   endSay {Array} 操作结束留言
 * @param   addSay {Array} 添加进入留言
 * @param   duration {Number} 间隔时间
 */
async function onRoomListionComeAndGo(data, message) {
    let { room } = data;
    const topic = await room.topic();

    if (topic === data.topic && rootListArr.includes(data.name) && message.text() === data.startText) {
        const contact = await bot.bot.Contact.find({name: data.userName});
        isRoomComeAndGoFlag = true
        timer = setInterval(async () => {
            if (contact) {
                if (await room.has(contact)) {
                    try {
                        await room.del(contact)
                    } catch(e) {
                        console.error(e)
                    }
                } else {
                    await room.add(contact)
                    data.addSay.forEach(async(val) => {
                        await room.say(val)
                    })
                }
            }
        }, data.duration)
    }
    if (topic === data.topic && rootListArr.includes(data.name) && message.text() === data.endText) {
        const contact = await bot.bot.Contact.find({name: data.userName});
        isRoomComeAndGoFlag = false
        clearInterval(timer)
        if (contact) {
            if (await room.has(contact)) {
            } else {
                await room.add(contact)
            }
            data.endSay.forEach(async(val) => {
                await room.say(val)
            })
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
    if (return_text.indexOf('emoji') > -1 && !isEmojiToImageFlag && rootListArr.includes(message.talker().name())) {
        url = return_text.split('cdnurl=')[1].split('designerid')[0];
        url = url.substring(1, url.length - 1);
        await message.say('正在转换路径，请稍后');
        const fileBox = FileBox.fromUrl('http://ljh.yangdagang.com/pictures/GszIUT5GePsBzumF8iw7z7ZR08ej6epQ4nh5Q-HP6ZWu5KRTNQZrhpVRq4AN-_uN.jpg');
        await message.say(fileBox);
        // if (url.indexOf('emoji') > -1) {
            
        // } else {
        //     const fileBox = FileBox.fromUrl(url);
        //     await message.say(fileBox);

        //     // let timestamp = new Date().getTime();
        //     // request(url).pipe(fs.createWriteStream(`${dir}/${timestamp}.jpg`));
        //     // await message.say(`api.yangdagang.com/src/images/${timestamp}.jpg`);
        // }W
    }
}

export default onMessage;

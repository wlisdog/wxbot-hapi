// const { onStopRemind } = require("../plugins/schedule");
// const request = require("request");
// const fs = require("fs");
// const path = require('path');
// const dir = path.join(__dirname + '/../images');

const bot = require('../../index') // 获取微信实例
let isRoomComeAndGoFlag = false
let timer = null
const rootListArr = [ "YHL.", "Srecko."]
const onMessage = (message) => {
    if (message.self()) return;
    onMessageInit(message);
};


/**
 * @Description 初始化消息方法
 */
async function onMessageInit(message) {
    await onRoomComeAndGo(message);
//   await onStopRemind(message, 'toLexInterval', 'Lex.');
//   await onEmojiToImage(message);
}

/**
 * @Description 群聊土遁-进进出出
 *  
 */

async function onRoomComeAndGo(message) {
    let room = message.room();
    // console.log(message)
    const name = message.talker().name();
    // console.log(rootListArr.includes(name), '是否为白名单')
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
        addSay: ['1', '2', '3'],
        duration: 5000
    }, message);
}

/**
 * @Description 群聊-进进出出
 * @param message Class 消息数据
 *        data Object 监听参数对象
 *          room  Class 群聊房间实例
 *          name String发送消息人昵称
 *          topic String 监听群聊名称匹配
 *          startText String 开始口令
 *          endText String 结束口令
 *          userName String 被操作人的微信昵称
 *          endSay Array 操作结束留言
 *          addSay Array 添加进入留言
 *          duration Number 间隔时间
 */
async function onRoomListionComeAndGo(data, message) {
    const contact = await bot.bot.Contact.find({name: data.userName});
    let { room } = data;
    const topic = await room.topic();
    // await room.say('<?xml version="1.0"?>\n' +
    // '<msg>\n' +
    // '\t<img aeskey="295c420c8cb91a70cf641df203c88eb8" encryver="1" cdnthumbaeskey="295c420c8cb91a70cf641df203c88eb8" cdnthumburl="3078020100046c306a02010002049e40ce6602032f4f5502042d73512a020461a6f0b3044533346234303336643033643235626339623436633733323865663733636239645f66393837633535642d633133352d346535642d616238612d3333373261393633393132340204012400010201000405004c4c6d00" cdnthumblength="3966" cdnthumbheight="150" cdnthumbwidth="148" cdnmidheight="0" cdnmidwidth="0" cdnhdheight="0" cdnhdwidth="0" cdnmidimgurl="3078020100046c306a02010002049e40ce6602032f4f5502042d73512a020461a6f0b3044533346234303336643033643235626339623436633733323865663733636239645f66393837633535642d633133352d346535642d616238612d3333373261393633393132340204012400010201000405004c4c6d00" length="49862" cdnbigimgurl="3078020100046c306a02010002049e40ce6602032f4f5502042d73512a020461a6f0b3044533346234303336643033643235626339623436633733323865663733636239645f66393837633535642d633133352d346535642d616238612d3333373261393633393132340204012400010201000405004c4c6d00" hdlength="49918" md5="02b4ae50caaa9f21c309fd1136339835" />\n' +
    // '</msg>\n',contact)

    if (topic === data.topic && rootListArr.includes(data.name) && message.text() === data.startText) {
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


// /**
//  * @desc 表情包转换图片路径
//  */
// async function onEmojiToImage(message) {
//   let return_text = message.text().replace(/\s/g,"").replace(/&amp;/g, "&");
//   let url;
//   if (return_text.indexOf('emoji') > -1) {
//     url = return_text.split('cdnurl=')[1].split('designerid')[0];
//     // url = url.substring(1, url.length - 2);
//     if (url.indexOf('emoji') > -1) {
//       await message.say(url);
//     } else {
//       let timestamp = new Date().getTime();
//       request(url).pipe(fs.createWriteStream(`${dir}/${timestamp}.jpg`));
//       await message.say(`api.yangdagang.com/src/images/${timestamp}.jpg`);
//     }
//   }
// }

module.exports = onMessage;

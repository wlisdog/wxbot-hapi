import bot from '../../../../bot/index.js';
const rootListArr = ['YHL.', 'Srecko.']; // 白名单 后期改为接口形式
let timer = null; // 是否开启群聊踢人定时器
let isRoomComeAndGoFlag = false; // 是否开启群聊踢人操作。 后期改为数据库存储
/**
 * 群聊土遁-进进出出
 * @param message {Class} 消息实例
 */

export async function onRoomComeAndGo(message) {
  let room = message.room();
  const name = message.talker().name();
  if (!room) {
    return;
  }
  onRoomListenComeAndGo(
    {
      room,
      name,
      topic: '测试测试',
      startText: '搞起搞起',
      endText: '好了好了',
      userName: 'lex.',
      endSay: ['over'],
      addSay: ['欢迎欢迎'],
      duration: 5000,
    },
    message
  );
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
async function onRoomListenComeAndGo(data, message) {
  let { room } = data;
  const topic = await room.topic();
  if (topic === data.topic && rootListArr.includes(data.name) && message.text() === data.startText) {
    const contact = await bot.Contact.find({ name: data.userName });
    isRoomComeAndGoFlag = true;
    timer = setInterval(async () => {
      if (contact) {
        if (await room.has(contact)) {
          try {
            await room.del(contact);
          } catch (e) {
            console.error(e);
          }
        } else {
          await room.add(contact);
          data.addSay.forEach(async val => {
            await room.say(val);
          });
        }
      }
    }, data.duration);
  }
  if (topic === data.topic && rootListArr.includes(data.name) && message.text() === data.endText) {
    const contact = await bot.Contact.find({ name: data.userName });
    isRoomComeAndGoFlag = false;
    clearInterval(timer);
    if (contact) {
      if (await room.has(contact)) {
      } else {
        await room.add(contact);
      }
      data.endSay.forEach(async val => {
        await room.say(val);
      });
    }
  }
}
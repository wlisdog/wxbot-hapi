// import axios from 'axios'
import axios from '../../../plugins/axios/index.js'
import { cancelSchedule } from '../../../plugins/schedule/index.js'
/**
 * 舔狗日志 - 剑网三第三方api
 * @param message {Class} 消息实例
 */
export async function onXiLiuDog(message) {
  if ( message.text() === '舔狗') {
    const {data} = await axios.get('https://www.jx3api.com/realize/random')
    await message.say(data.text);
  }
}

/**
 * 舔狗日志 - 关闭定时
 * @param message {Class} 消息实例
 */
export async function onXiLiuDogClose(message) {
  if ( message.text() === '关闭定时') {
    cancelSchedule('everydayxiliu');
    await message.say('已关闭');
    // const {data} = await axios.get('https://www.jx3api.com/realize/random')
  }
}

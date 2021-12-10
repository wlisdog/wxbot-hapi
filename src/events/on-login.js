/**
 * @desc 登录初始化
 * @date 2021年11月29日14:10:47
 */
import { onToWeatherRemind,onToClockReminded } from "../plugins/schedule/index.js";

async function onLogin (user) {
  console.log(`${user.payload.name}你好啊~`)
  await onLoginInit();
};

async function onLoginInit () {
  await onToWeatherRemind();
  await onToClockReminded();
}
export default onLogin;

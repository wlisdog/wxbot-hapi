/**
 * @desc 登录初始化
 * @date 2021年11月29日14:10:47
 */
import { onToRestartReminded,onToWeatherRemind,onToGoToWorkClockReminded,onToAfterWorkClockReminded,onToGoToWorkClock2Reminded,onToAfterWorkClock2Reminded,onToGoToWorkClock3Reminded,onToAfterWorkClock3Reminded,onToEveryDayReminded} from "../plugins/schedule/index.js";

async function onLogin (user) {
  console.log(`${user.payload.name}你好啊~`)
  await onLoginInit();
};

async function onLoginInit () {
  await onToRestartReminded();
  await onToWeatherRemind();
  await onToGoToWorkClockReminded();
  await onToAfterWorkClockReminded();
  await onToGoToWorkClock2Reminded();
  await onToAfterWorkClock2Reminded();
  await onToGoToWorkClock3Reminded();
  await onToAfterWorkClock3Reminded();
  await onToEveryDayReminded();
  
}
export default onLogin;

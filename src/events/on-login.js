/**
 * @desc 登录初始化
 * @date 2021年11月29日14:10:47
 */
 import { onToRestartReminded,
          onToWeatherRemind,
          onToGoDailyReminded,
          onToCheckServerReminded,
          onToGoToWorkClock1Reminded,
          onToAfterWorkClock1Reminded,
          onToAfterWorkClock2Reminded,
          onToEveryDayReminded} from "../plugins/schedule/index.js";

 async function onLogin (user) {
   console.log(`${user.payload.name}你好啊~`)
   await onLoginInit();
 };
 
 async function onLoginInit () {
   await onToRestartReminded();
   await onToWeatherRemind();
   await onToCheckServerReminded();
   await onToGoDailyReminded();
   await onToGoToWorkClock1Reminded();
   await onToAfterWorkClock1Reminded();
   await onToAfterWorkClock2Reminded();
   await onToEveryDayReminded();
   
 }
 export default onLogin;
 
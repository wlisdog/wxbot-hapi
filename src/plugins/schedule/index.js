/*
 * @Description:  定时任务
 * @Date: 2021-11-3016:34:52
 */
import schedule from 'node-schedule';
import dayjs from 'dayjs';
import bot from "../../../index.js";
import {sleep} from '../../../src/events/sleepThread.js';
import query from '../../../src/events/testMySQL.js';
import {getWeather,getImage} from '../../../src/events/webServiceLink.js';
const rootListArr = [ "Srecko."] 

//其他规则见  
// 规则参数讲解    *代表通配符
// *  *  *  *  *  *
// ┬  ┬  ┬  ┬  ┬  ┬
// │  │  │  │  │  |
// │  │  │  │  │  └ day of week (0 - 7) (0 or 7 is Sun)
// │  │  │  │  └───── month (1 - 12)
// │  │  │  └────────── day of month (1 - 31)
// │  │  └─────────────── hour (0 - 23)
// │  └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
// 每分钟的第30秒触发： '30 * * * * *'
//
// 每小时的1分30秒触发 ：'30 1 * * * *'
//
// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
//
// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
//
// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

function setSchedule(name, date, callback) {
  schedule.scheduleJob(name, date, callback)
}

function cancelSchedule(name) {
  let myJob = schedule.scheduledJobs[name];
  myJob.cancel()
}


/**
 * @desc 提醒公共方法
 */
 const onToPublicmethodReminded = async () => {
  // const timer = "00 30 08 * * 1-5";
  const date = new Date(2022,0,14,9,56,30);
  setSchedule('lex1', date, async () => {
 
          const room2 = await bot.bot.Room.find('朵朵');
          if(room2){
            await room2.say('定时提醒')
          }

  });
}



/**
 * @desc 每日提醒
 */
const onToWeatherRemind = async () => {
    const timer = "00 00 07 * * *";
    setSchedule('WeatherRemind', timer, async () => {
            console.log('进入每日提醒定时任务') 

            // 根据日期形成
            const nowdate = dayjs().format('YYYY-MM-DD')
            
            const sql = "select * from dateinfo where date = '"+nowdate+"'";
            const messageJson = await query(sql);
            let remind = "今天是"+messageJson[0].dateformat+"，"+messageJson[0].weekformat+"";
            if(messageJson[0].holiday != "" && messageJson[0].holiday != null){
                remind = remind +"，" + "今天是" + messageJson[0].holiday
            }
            if(messageJson[0].greet != ""  && messageJson[0].greet != null){
                remind = remind +"，" + messageJson[0].greet
            }
            console.log(remind)

            let city = '北京';
            let weatherMessage = await getWeather(city);
            let weatherInfo = eval('/'+city+'/')
            if(weatherInfo.test(weatherMessage.return)){
              const room2 = await bot.bot.Room.find('打卡');

              if(room2){
                await room2.say('早上好~');
                await sleep(1000);
  
                await room2.say(remind);
                await sleep(1000);
    
                await room2.say('下面是天气预报');
                await sleep(1000);   
    
                await room2.say(weatherMessage.return);
                await sleep(1000);   
              }


   
              const room3 = await bot.bot.Room.find('11111');

              if(room3){
                                
                await room3.say('早上好~');
                await sleep(1000); 
              
                await room3.say(remind);
                await sleep(1000);
              
                await room3.say('下面是天气预报');
                await sleep(1000);   
  
                await room3.say(weatherMessage.return);
                await sleep(1000); 
  
              }
              
  
  
              const room5 = await bot.bot.Room.find('收购BAT蓝天计划之技术交流群');

              if(room5){

                await room5.say('早上好~');
                await sleep(1000);
  
                await room5.say(remind);
                await sleep(1000);   
                
                await room5.say('下面是天气预报');
                await sleep(1000);   
    
                await room5.say(weatherMessage.return);
                await sleep(1000);   
              }
  
              
              const room6 = await bot.bot.Room.find('朵朵');
  
              if(room6){

                await room6.say('早上好~');
                await sleep(1000);
  
                await room6.say(remind);
                await sleep(1000);   
                
                await room6.say('下面是天气预报');
                await sleep(1000);   
    
                await room6.say(weatherMessage.return);
                await sleep(1000);  
              }


            }else{
                // 天气信息不匹配 打印信息
                console.log(weatherInfo)
            }
            city = '长沙';
            weatherInfo = eval('/'+city+'/')
            weatherMessage = await getWeather(city);
            if(weatherInfo.test(weatherMessage.return)){
              const room4 = await bot.bot.Room.find('多多');
            
              if(room4){
              
                await room4.say('早上好~');
                await sleep(1000);   

                await room4.say(remind);
                await sleep(1000); 
  
                await room4.say('下面是天气预报');
                await sleep(1000);   
  
                await room4.say(weatherMessage.return);
              }
              
            }else{
              // 天气信息不匹配 打印信息
              console.log(weatherInfo)
          }


    });
}




/**
 * @desc 上班打卡提醒
 */
 const onToGoToWorkClockReminded = async () => {
  const timer = "00 30 08 * * 1-5";
  setSchedule('GoToWorkClockReminded', timer, async () => {
 
          const room2 = await bot.bot.Room.find('打卡');
          await room2.say('已经到了上班时间，请不要忘记打卡。')

  });
}




/**
 * @desc 下班打卡提醒
 */
 const onToAfterWorkClockReminded = async () => {
  const timer = "00 00 18 * * 1-5";
  setSchedule('AfterWorkClockReminded', timer, async () => {
 
          const room2 = await bot.bot.Room.find('打卡');
          await room2.say('已经到了下班时间，请不要忘记打卡。')

  });
}





/**
 * @desc 上班打卡提醒
 */
 const onToGoToWorkClock2Reminded = async () => {
  const timer = "00 00 08 * * 1-5";
  setSchedule('GoToWorkClockReminded', timer, async () => {
 
          const room2 = await bot.bot.Room.find('多多');
          await room2.say('已经到了上班时间，请不要忘记打卡。')

  });
}




/**
 * @desc 下班打卡提醒
 */
 const onToAfterWorkClock2Reminded = async () => {
  const timer = "00 30 17 * * 1-5";
  setSchedule('AfterWorkClockReminded', timer, async () => {
 
          const room2 = await bot.bot.Room.find('多多');
          await room2.say('已经到了下班时间，请不要忘记打卡。')

  });
}

async function stop() {
  await sleep(1000);   //暂停1秒
}

export {
  onToWeatherRemind,
  onToPublicmethodReminded,
  onToGoToWorkClockReminded,
  onToAfterWorkClockReminded,
  onToGoToWorkClock2Reminded,
  onToAfterWorkClock2Reminded,
  cancelSchedule,
  stop
};

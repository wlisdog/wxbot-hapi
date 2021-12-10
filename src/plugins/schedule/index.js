/*
 * @Description:  定时任务
 * @Date: 2021-11-3016:34:52
 */
import schedule from 'node-schedule';
import dayjs from 'dayjs';
import bot from "../../../index.js";
import test from '../../../src/events/testMySQL.js';
import {sleep} from '../../../src/events/sleepThread.js';

//其他规则见 https://www.npmjs.com/package/node-schedule
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
 * @desc 天气提醒
 */
const onToWeatherRemind = async () => {
    const timer = "00 00 07 * * *";
    setSchedule('WeatherRemind', timer, async () => {
            console.log('进入定时任务') 
            let cityname = '北京';
            
            let date = dayjs().format('YYYY-MM-DD')
            let sql = `select a.Content from weatherInfo a where a.CityName = '${cityname}' and a.Create_Date = '${date}' and a.Create_Time = (select max(w.Create_Time) from weatherInfo w where w.CityName = '${cityname}' and w.Create_Date = '${date}' )`;
            let weatherJson = await test(sql);

            let Content = weatherJson[0].Content
            const room2 = bot.bot.Room.find('打卡');
            (await room2).say('早上好~')
            await sleep(1000);   //暂停1秒
            sql = ``;

            (await room2).say('下面是天气预报');
            await sleep(1000);   //暂停1秒
            sql = ``;

            (await room2).say(Content);
            await sleep(1000);   //暂停1秒
            sql = ``;
 
            const room3 = bot.bot.Room.find('11111');
            (await room3).say('早上好~');
            await sleep(1000);   //暂停1秒
            sql = ``;
            
            (await room3).say('下面是天气预报');
            await sleep(1000);   //暂停1秒
            sql = ``;

            (await room3).say(Content);
            await sleep(1000);   //暂停1秒
            sql = ``;

            cityname = '长沙';
            sql = `select a.Content from weatherInfo a where a.CityName = '${cityname}' and a.Create_Date = '${date}' and a.Create_Time = (select max(w.Create_Time) from weatherInfo w where w.CityName = '${cityname}' and w.Create_Date = '${date}' )`;
            weatherJson = await test(sql);
            Content = weatherJson[0].Content
            const room4 = bot.bot.Room.find('多多');
            (await room4).say('早上好~');
            await sleep(1000);   //暂停1秒
            sql = ``;

            (await room4).say('下面是天气预报');
            await sleep(1000);   //暂停1秒
            sql = ``;

            (await room4).say(Content);

    });
}




/**
 * @desc 打卡提醒
 */
 const onToClockReminded = async () => {
  const timer = "00 00 18 * * *";
  setSchedule('ClockReminded', timer, async () => {
 
          const room2 = bot.bot.Room.find('打卡');
          (await room2).say('已经到了下班时间，请不要忘记打卡。')

  });
}

async function stop() {
  await sleep(1000);   //暂停1秒
}

export {
  onToWeatherRemind,
  onToClockReminded,
  cancelSchedule,
  stop
};

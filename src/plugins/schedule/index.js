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
import {getDaily,getCheck,getNews} from '../../../src/events/JX3Interface.js';
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
 * @desc 定时任务提醒公共方法
 */
 const onToPublicmethodReminded = async (timestamp) => {
  
  const sql = "select UserName,RoomId,Schedule,Message from timerremindinfo where TimeStamp = '"+timestamp+"'";
  const messageJson = await query(sql);
  const userName = messageJson[0].UserName
  const roomId = messageJson[0].RoomId
  const schedule = messageJson[0].Schedule
  const message = messageJson[0].Message
  const scheduleJson = schedule.split(',');
  const year = scheduleJson[0]
  const month = scheduleJson[1]
  const day = scheduleJson[2]
  const hours = scheduleJson[3]
  const minutes = scheduleJson[4]
  const seconds = scheduleJson[5]

  // const timer = "00 30 08 * * 1-5";
  const date = new Date(year,month,day,hours,minutes,seconds);
  setSchedule(timestamp, date, async () => {
 
          const room = await bot.bot.Room.find({id: roomId}) 
          const members = await room.member({name: userName}) 
          if(room){
            await room.say(message,members)
          }

  });
}

/**
 * @desc 配置队列提醒公共方法
 */
 const onToQueuemethodReminded = async (timestamp) => {
  
  const sql = "select UserName,RoomId,Schedule,Message,RoomAlias from timerremindinfo where TimeStamp = '"+timestamp+"'";
  const messageJson = await query(sql);
  const userName = messageJson[0].UserName
  const roomAlias = messageJson[0].RoomAlias
  const roomId = messageJson[0].RoomId
  const schedule = messageJson[0].Schedule
  const message = messageJson[0].Message

  // const timer = "00 30 08 * * 1-5";
  setSchedule(timestamp, schedule, async () => {
 
          const room = await bot.bot.Room.find({id: roomId}) 
          if(room){
            if(userName === 'ALL'){
              await room.say(message)
            }if(userName === '0012185'){
              const members = await room.member({roomAlias: roomAlias}) 
              await room.say(message,members)
            }else{
              const members = await room.member({name: userName}) 
              await room.say(message,members)
            }
          }

  });
}

/**
 * @desc 重启项目加载所有未提醒内容
 */
 const onToRestartReminded = async () => {
  const date = dayjs().format('YYYY-MM-DD')
  const time = dayjs().format('HH:mm:ss')

  const sql = "select TimeStamp from timerremindinfo where Remind_Sign = '1' and Remind_Date >= '"+date+"' ";
  const sql2 = "select TimeStamp from timerremindinfo where Remind_Sign = '0' ";
  const messageJson = await query(sql);
  const messageJson2 = await query(sql2);
  
  messageJson.forEach((val) => {onToPublicmethodReminded(val.TimeStamp)})
  messageJson2.forEach((val) => {onToQueuemethodReminded(val.TimeStamp)})

}

/**
 * @desc 每日早晨问候
 */
const onToWeatherRemind = async () => {
    const timer = "00 00 07 * * *";
    setSchedule('WeatherRemind', timer, async () => {
            console.log('进入每日提醒定时任务') 

            // 根据日期形成
            const day = dayjs().format('DD')

            const nowdate = dayjs().format('YYYY-MM-DD')

            // 构造提醒内容
            const sql = "select * from dateinfo where date = '"+nowdate+"'";
            const messageJson = await query(sql);
            let remind = "今天是"+messageJson[0].dateformat+"，"+messageJson[0].weekformat+"";
            if(messageJson[0].holiday != "" && messageJson[0].holiday != null){
                remind = remind +"，" + "今天是" + messageJson[0].holiday
            }
            if(messageJson[0].greet != ""  && messageJson[0].greet != null){
                remind = remind +"，" + messageJson[0].greet
            }

            let city = '北京';
            let weatherMessage = await getWeather(city);
            let weatherInfo = eval('/'+city+'/')

            const weathersql = "select (@rownum:=@rownum+1) as row,roomid from (select @rownum :=0) r,roompurview where weatherremind = 'Y'";
            const weathermessageJson = await query(weathersql);
  
            weathermessageJson.forEach(async(val) => {
              await sleep(1000*val.row);
              const room2 = await bot.bot.Room.find({id: val.roomid}); 
              if(room2){
                await room2.say('早上好~');
                await sleep(1000);
    
                await room2.say(remind);
                await sleep(1000);

              if(day === '25'){
                await room2.say('每月25日天气系统维护，无法提供天气信息。由此给您带来的不便我们深表歉意，感谢您长期以来的支持。');
                await sleep(1000);
              }else if(weatherInfo.test(weatherMessage.return)){
                await room2.say('下面是天气预报');
                await sleep(1000);   
      
                await room2.say(weatherMessage.return);
                await sleep(1000); 
              }
              else{
                await room2.say('天气系统维护，无法提供天气信息。由此给您带来的不便我们深表歉意，感谢您长期以来的支持。');
                await sleep(1000);
              }
            }
          })

    });
}





/**
 * @desc 剑三每日日常推送
 */
 const onToGoDailyReminded = async () => {
  const timer = "00 30 08 * * *";
  setSchedule('onToGoDailyReminded', timer, async () => {


    const room = await bot.bot.Room.find('朵朵');
    const room2 = await bot.bot.Room.find('茶');
    const server = '破阵子';
    const num = '0';
    const dailyMessage = await getDaily(server,num);
    console.log(dailyMessage.data.data.team)
    const dailyData = dailyMessage.data.data
    const groupData = dailyData.team
    const sql = "select * from dateinfo where date = '"+dailyData.date+"'";
    const messageJson = await query(sql);

    if(dailyData.draw){
      room.say("早上好啊！~( ´∀` )~"+"\n"+
        "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
        "【秘境大战】 "+dailyData.war+"\n"+
        "【今日战场】 "+dailyData.battle+"\n"+
        "【阵营任务】 "+dailyData.camp+"\n"+
        "【美人画像】 "+dailyData.draw+"\n"+"\n"+
        "【武林通鉴·公共任务】 "+"\n"+groupData[0]+"\n"+
        "【武林通鉴·秘境任务】 "+"\n"+groupData[1]+"\n"+
        "【武林通鉴·团队秘境】 "+"\n"+groupData[2]) 
      room2.say("早上好啊！~( ´∀` )~"+"\n"+
        "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
        "【秘境大战】 "+dailyData.war+"\n"+
        "【今日战场】 "+dailyData.battle+"\n"+
        "【阵营任务】 "+dailyData.camp+"\n"+
        "【美人画像】 "+dailyData.draw+"\n"+"\n"+
        "【武林通鉴·公共任务】 "+"\n"+groupData[0]+"\n"+
        "【武林通鉴·秘境任务】 "+"\n"+groupData[1]+"\n"+
        "【武林通鉴·团队秘境】 "+"\n"+groupData[2]) 
    }else{
      room.say("早上好啊！~( ´∀` )~"+"\n"+
        "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
        "【秘境大战】 "+dailyData.war+"\n"+
        "【今日战场】 "+dailyData.battle+"\n"+
        "【阵营任务】 "+dailyData.camp+"\n"+"\n"+
        "【武林通鉴·公共任务】 "+"\n"+groupData[0]+"\n"+
        "【武林通鉴·秘境任务】 "+"\n"+groupData[1]+"\n"+
        "【武林通鉴·团队秘境】 "+"\n"+groupData[2]) 
      room2.say("早上好啊！~( ´∀` )~"+"\n"+
        "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
        "【秘境大战】 "+dailyData.war+"\n"+
        "【今日战场】 "+dailyData.battle+"\n"+
        "【阵营任务】 "+dailyData.camp+"\n"+"\n"+
        "【武林通鉴·公共任务】 "+"\n"+groupData[0]+"\n"+
        "【武林通鉴·秘境任务】 "+"\n"+groupData[1]+"\n"+
        "【武林通鉴·团队秘境】 "+"\n"+groupData[2]) 
    }

  });
}

/**
 * @desc 检查开服状态及官方信息
 */
 const onToCheckServerReminded = async () => {
  const timer = "0 * * * * *";
  setSchedule('CheckServerReminded', timer, async () => {

    // 检查开服状态
    const name = "破阵子";
    const requireMessage = await getCheck(name);
    const requireData = requireMessage.data.data.status

    const checkjx3statussql = "SELECT code from basiscode where codetype = 'JX3ServerStatus'";
    const checkjx3statusJson = await query(checkjx3statussql);
    const status = checkjx3statusJson[0].code
    if(requireData === Number(status)){

    }else{
      const checkjx3statussql = "update basiscode set code = '"+requireData+"' where codetype = 'JX3ServerStatus'";
      await query(checkjx3statussql);

      const room2 = await bot.bot.Room.find('朵朵');
      const room3 = await bot.bot.Room.find('茶');
      await room2.sync()
      await room3.sync()
      if(requireData === 0){
          room2.say("念破  已开始维护")
          room3.say("念破  已开始维护")
      }
      if(requireData === 1){
          room2.say("开服 破阵子(•̀ᴗ•́)")
          room3.say("开服 破阵子(•̀ᴗ•́)")
      }
    }
    // 检查官方信息
    const requirenewsMessage = await getNews(5);
    const requirenewsData = requirenewsMessage.data.data

    requirenewsData.forEach(async(val) => {

      const checkhavingnewssql = "SELECT id from jx3news where id = '"+val.id+"'";
      const checkhavingnewsJson = await query(checkhavingnewssql);
      
      if(!checkhavingnewsJson.length){
          const checkjx3newssql = "INSERT INTO `wechat_test`.`jx3news` (`id`, `value`, `type`, `title`, `date`, `url`) VALUES ('"+val.id+"', '"+val.value+"', '"+val.type+"', '"+val.title+"', '"+val.date+"', '"+val.url+"') ";
          await query(checkjx3newssql);
          const room2 = await bot.bot.Room.find('朵朵');
          const room3 = await bot.bot.Room.find('茶');
          await room2.sync()
          await room3.sync()
          room2.say(val.type+"\n"+
              "标题："+val.title+"\n"+
              "日期："+val.date+"\n"+
              "链接："+val.url) 
          room3.say(val.type+"\n"+
              "标题："+val.title+"\n"+
              "日期："+val.date+"\n"+
              "链接："+val.url) 
      }
              
    })
  });
}


async function stop() {
  await sleep(1000);   //暂停1秒
}

export {
  onToRestartReminded,
  onToWeatherRemind,
  onToPublicmethodReminded,
  onToQueuemethodReminded,
  onToGoDailyReminded,
  onToCheckServerReminded,
  cancelSchedule,
  stop
};

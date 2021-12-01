/*
 * @Description:  定时任务
 * @Date: 2021-11-3016:34:52
 */
const schedule = require('node-schedule');
const bot = require("../../../index");

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
 * @desc 小王下班几点回家~
 */
const onToWorkMyGirl = async () => {
    const timer = "0 0 19 * * *";
    setSchedule('everydaygirl', timer, async () => {
            console.log('进入定时任务')
            let contactGirl = await bot.bot.Contact.find({ name: '小抽基' });
            await contactGirl.say('王总，今日几时到达位置，卑职已经等不及了, 望回复~');
    });
}

module.exports = {
  onToWorkMyGirl
};

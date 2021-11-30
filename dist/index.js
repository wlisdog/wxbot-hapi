var WechatyBuilder = require('wechaty').WechatyBuilder;
var onScan = require('./src/events').onScan;
console.log(onScan, '111');
// const bot = WechatyBuilder.build({
//     name: 'ding',
//     puppet: 'wechaty-puppet-wechat'
// })
// bot.on('scan', onScan)
// bot.on('login',            (user: any) => console.log(`User ${user} logged in`))
// bot.on('message',       (message: any) => console.log(`发消息啦Message: ${message}`))
// bot.start()

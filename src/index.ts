const {
    WechatyBuilder,
    log,
    ScanStatus
} = require('wechaty')
const qrcodeTerminal  = require('qrcode-terminal')

const bot = WechatyBuilder.build({
    name: 'ding',
    puppet: 'wechaty-puppet-wechat'
})
bot.on('scan', (qrcode: any, status: any) => {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
     
        const qrcodeImageUrl = [
          'https://wechaty.js.org/qrcode/',
          encodeURIComponent(qrcode),
        ].join('')
    
        log.info('开始机器', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
    
      } else {
        log.info('开始机器', 'onScan: %s(%s)', ScanStatus[status], status)
      }
})
bot.on('login',            (user: any) => console.log(`User ${user} logged in`))
bot.on('message',       (message: any) => console.log(`发消息啦Message: ${message}`))
bot.start()
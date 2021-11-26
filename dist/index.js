var _a = require('wechaty'), WechatyBuilder = _a.WechatyBuilder, log = _a.log, ScanStatus = _a.ScanStatus;
var qrcodeTerminal = require('qrcode-terminal');
var bot = WechatyBuilder.build({
    name: 'ding',
    puppet: 'wechaty-puppet-wechat'
});
bot.on('scan', function (qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console
        var qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('');
        log.info('开始机器', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
    }
    else {
        log.info('开始机器', 'onScan: %s(%s)', ScanStatus[status], status);
    }
});
bot.on('login', function (user) { return console.log("User ".concat(user, " logged in")); });
bot.on('message', function (message) { return console.log("\u53D1\u6D88\u606F\u5566Message: ".concat(message)); });
bot.start();

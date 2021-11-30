const qrcodeTerminal  = require('qrcode-terminal');
const {
    ScanStatus,
    log,
} = require('wechaty');

const onScan = (qrcode, status) => {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrcodeTerminal.generate(qrcode, { small: true });  // show qrcode on console
        const qrcodeImageUrl = [
          'https://wechaty.js.org/qrcode/',
          encodeURIComponent(qrcode),
        ].join('');
        log.info('开始机器', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
      } else {
        log.info('开始机器', 'onScan: %s(%s)', ScanStatus[status], status);
      }
};

module.exports = onScan;


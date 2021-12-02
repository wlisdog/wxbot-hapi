import qrcodeTerminal from 'qrcode-terminal';
import {
    ScanStatus,
    log,
} from 'wechaty';

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

export default onScan;

import { FileBox } from 'wechaty';
const rootListArr = ['YHL.', 'Srecko.']; // 白名单 后期改为接口形式
let isEmojiToImageFlag = false; // 是否开启表情包转图片功能。 后期改为数据库存储

/**
 * 表情包转换图片开关
 * @param message {Class} 消息实例
 */
export async function onEmojiToImageFlag(message) {
  const name = message.talker().name();
  // 判断是否为有权限用户
  if (rootListArr.includes(name) && message.text() === '开启表情包转换') {
    isEmojiToImageFlag = true;
    message.say(`开启表情包转换成功~`);
  }
  if (rootListArr.includes(name) && message.text() === '关闭表情包转换') {
    isEmojiToImageFlag = false;
    message.say(`关闭表情包转换成功~`);
  }
}

/**
 * 表情包转换图片路径
 * @param message {Class} 消息实例
 *
 */
export async function onEmojiToImage(message) {
  let return_text = message.text().replace(/\s/g, '').replace(/&amp;/g, '&');
  let url;
  if (return_text.indexOf('emoji') > -1 && !isEmojiToImageFlag && rootListArr.includes(message.talker().name())) {
    url = return_text.split('cdnurl=')[1].split('designerid')[0];
    url = url.substring(1, url.length - 1);
    await message.say('正在转换图片，请稍后...');

    // const fileBox = FileBox.fromUrl('http://ljh.yangdagang.com/pictures/GszIUT5GePsBzumF8iw7z7ZR08ej6epQ4nh5Q-HP6ZWu5KRTNQZrhpVRq4AN-_uN.jpg');
    // await message.say(fileBox);

    const fileBox = FileBox.fromUrl(url, '1.jpg');
    await message.say(fileBox);

    // let timestamp = new Date().getTime();
    // request(url).pipe(fs.createWriteStream(`${dir}/${timestamp}.jpg`));
    // await message.say(`api.yangdagang.com/src/images/${timestamp}.jpg`);
  }
}

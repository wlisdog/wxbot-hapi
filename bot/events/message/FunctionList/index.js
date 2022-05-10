const rootListArr = ['YHL.', 'Srecko.']; // 白名单 后期改为接口形式

/**
 * 功能列表回复 - 后期改为接口形式
 * @param message {Class} 消息实例
 */
export async function onFunctionList(message) {
  const name = message.talker().name();
  // 判断是否为有权限用户
  if (rootListArr.includes(name) && message.text() === '功能列表') {
    message.say(`
      1. 微信群拉人踢人骂人一体化。
      2. 表情包转图片。
      3. 定时任务消息。
      4. 昆哥语录(待开发)。
    `);
  }
}

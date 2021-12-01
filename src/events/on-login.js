/**
 * @desc 登录初始化
 * @date 2021年11月29日14:10:47
 */
const { onToWorkMyGirl } = require("../plugins/schedule");

async function onLogin (user) {
  console.log(`${user.payload.name}你好啊~`)
  await onLoginInit();
};

async function onLoginInit () {
  await onToWorkMyGirl();
}
module.exports = onLogin;

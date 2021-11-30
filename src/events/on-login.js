/**
 * @desc 登录初始化
 * @date 2021年11月29日14:10:47
 */
// const { onPunchCardRemind, onToWorkMyGirl } = require("../plugins/schedule");

function onLogin (user) {
  console.log(`${user.payload.name}你好啊~`)
//   await onLoginInit();
};

// async function onLoginInit () {
//   await onToWorkMyGirl();
//   await onPunchCardRemind("0 0 18 * * *", 5, 'Lex.', 'toLexInterval');
// }
module.exports = onLogin;

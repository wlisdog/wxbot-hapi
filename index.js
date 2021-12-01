const {
    Wechaty,
} = require('wechaty');
const { onScan, onLogin, onMessage, onReply } = require('./src/events');
const { PuppetPadlocal } = require("wechaty-puppet-padlocal");
const puppet = new PuppetPadlocal({
    token: 'puppet_padlocal_4ba913f47e8c418893abf899ed1b2d4f',
  });
const bot = new Wechaty({
    name: 'ding',
    puppet,
    // puppet: 'wechaty-puppet-wechat',
})
bot
.on('scan', onScan)
.on('login', onLogin)
.on('message', onMessage)
.on('message', onReply)

/**
 * Global Event: room-join
 */
// .on('room-join', async function(room, inviteeList, inviter) {
//     log.info( 'Bot', 'EVENT: room-join - Room "%s" got new member "%s", invited by "%s"',
//         await room.topic(),
//         inviteeList.map(c => c.name()).join(','),
//         inviter.name(),
//     )
//     console.log('bot room-join room id:', room.id)
//     const contact = await bot.Contact.find({name: 'YHL.'})
//     contact.say('可以了')
//     // const topic = await room.topic()
//     // await room.say(`welcome to "${topic}"!`, inviteeList[0])
// })
.start()
.catch(console.error)

module.exports.bot = bot;

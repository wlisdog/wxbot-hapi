import { Wechaty } from 'wechaty';

import { onScan, onLogin, onMessage } from './events/index.js';
import { PuppetPadlocal } from 'wechaty-puppet-padlocal';
// 动态接码
const puppet = new PuppetPadlocal({
  token: 'puppet_padlocal_d892354f77d349f2b7b5f1ad8cd4c068',
});
const bot = new Wechaty({
  name: 'ding',
  puppet,
});

bot.on('scan', onScan).on('login', onLogin).on('message', onMessage);
// .catch(console.error);

// .start()

// // http
// var server = http.createServer(function(req, res) {
//     // console.log(req, req.url)
//     console.log(req.url, '-------')
//     // res.writeHead(200, { "Content-type": "text/html;charset=UTF8" })
//     if (req.url == '/qrcode.html') {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.writeHead(200, { "Content-type": "text/html;charset=UTF8" })
//             // res.write('成功写入')
//             fs.readFile('./qrcode.html',(err,data)=>{
//                 res.end(data.toString())
//             })
//     } if (req.url.indexOf('/api/postRecord') > -1 ) {
//         // res.setHeader('Access-Control-Allow-Origin', '*');
//         // res.writeHead(200, { "Content-type": "text/html;charset=UTF8" })
//         //     // res.write('成功写入')
//         //     fs.readFile('./qrcode.html',(err,data)=>{
//         loginCode = req.url.split('?')[1];
//         res.end('哈哈哈哈哈')
//         //     })
//     } if (req.url.indexOf('/api/getRecord') > -1 ) {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.writeHead(200, { "Content-type": "text/html;charset=UTF8" })
//             res.write(loginCode)
//         //     fs.readFile('./qrcode.html',(err,data)=>{
//         //         loginCode = '我的纸';
//                 res.end()
//         //     })

//     }
// })
// server.listen(8081)

export default bot;

// /**
//  * Global Event: room-join
//  */
// // .on('room-join', async function(room, inviteeList, inviter) {
// //     log.info( 'Bot', 'EVENT: room-join - Room "%s" got new member "%s", invited by "%s"',
// //         await room.topic(),
// //         inviteeList.map(c => c.name()).join(','),
// //         inviter.name(),
// //     )
// //     console.log('bot room-join room id:', room.id)
// //     const contact = await bot.Contact.find({name: 'YHL.'})
// //     contact.say('可以了')
// //     // const topic = await room.topic()
// //     // await room.say(`welcome to "${topic}"!`, inviteeList[0])
// // })

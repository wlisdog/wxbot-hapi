/**
 * @author Srecko
 * @desc: 回复消息(群聊)
 * @date 2021-12-1
 */
 import {
    UrlLink,
    FileBox,
    Room
} from 'wechaty';
import dayjs from 'dayjs';
import {sleep} from './sleepThread.js';
import bot  from '../../index.js'; // 获取微信实例
import commonInfoUrl  from './common.js'; 
import {getWeather,getImage,getTimer} from './webServiceLink.js';
import {getDaily,
    getDemon,
    getRandom,
    getReRandom,
    getRequire,
    getStrategy,
    getPrice,
    getNews,
    getHorse,
    getCheck,
    getRecent,
    getSerendipity,
    getStatistical,
    getAttribute,
    getFirework,
    getRecruit,
    getExcellent} from './JX3Interface.js';
// import {getreply} from './nlpchatInterface.js';
import query from './testMySQL.js';
import {onToPublicmethodReminded } from "../plugins/schedule/index.js";

const rootListArr = [ "Y", "S"] 

const onReply = (message) => {
    
    if (message.self()) return;
    onMessageInit(message);
};

/**
 * @Description 初始化消息方法
 */
 async function onMessageInit(message) {
    let room = message.room();
    
    // 不是群消息直接返回
    if (!room) {
        return;
    }
    // 目前先对关键字全部功能放行，限制表情包
    await onReplyMessage(message);

    // 判断机器人回复功能是否开启
    const id = room.id
    const contact = message.talker().name()
    const purviewsql = "select totalpurview from roompurview where roomid = '"+id+"'";
    const totalpurviewJson = await query(purviewsql);
    let totalpurview
    if(!totalpurviewJson.length == 0){
        totalpurview = totalpurviewJson[0].totalpurview
    }else{
        totalpurview = 'N'
    }
    
    // 不是超级权限者并且没有配置群权限直接返回
    if(!rootListArr.includes(contact) && totalpurview == 'N'){
        return;
    }
    await onEmojiToImage(message);
}

/**
 * @Description 发送消息
 */
async function onReplyMessage(message) {
    const room = message.room();
    const text = message.text();

    if (room !== null ){
        if(text === '当前时间'){
            console.log(dayjs().format('YYYY-MM-DD HH:mm:ss SSS')) 
            room.say(dayjs().format('YYYY-MM-DD HH:mm:ss'))
        }
        if(text === '随机图片'){
            const sql = 'select MediaId from imagemessage order by rand() limit 1';
            const messageJson = await query(sql);
            const mediaId = messageJson[0].MediaId
            console.log(mediaId)
            const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.jpg`);
            room.say(fileBox) 
        } 
        if (/名片/.test(text)) { 
            const contactCard = await bot.bot.Contact.find({name: 'Srecko.'}) 
            if (!contactCard) {
                 console.log('not found') 
                return 
            } 
            await room.say(contactCard) 
        }
        if(/天气 /.test(text) && text.startsWith('天气')){
            const city = text.substring(3);
            console.log(city)
            const weatherMessage = await getWeather(city);
            const weatherInfo = eval('/'+city+'/')
            if(weatherInfo.test(weatherMessage.return)){
                room.say(weatherMessage.return) 
            }else{
                room.say('未查到需要的天气记录，天气查询格式应为: XX天气    XX为所查询的城市名称')
            }
        }
        if(text === '日常'){
            const server = '破阵子';
            const num = '0';
            const dailyMessage = await getDaily(server,num);
            const dailyData = dailyMessage.data.data
            const groupData = dailyData.team
            const sql = "select * from dateinfo where date = '"+dailyData.date+"'";
            const messageJson = await query(sql);

            if(dailyData.draw){
                room.say("大侠好！~( ´∀` )~"+"\n"+
                    "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
                    "【秘境大战】 "+dailyData.war+"\n"+
                    "【今日战场】 "+dailyData.battle+"\n"+
                    "【阵营任务】 "+dailyData.camp+"\n"+
                    "【美人画像】 "+dailyData.draw+"\n"+"\n"+
                    "【武林通鉴·公共任务】 "+"\n"+groupData[0]+"\n"+
                    "【武林通鉴·秘境任务】 "+"\n"+groupData[1]+"\n"+
                    "【武林通鉴·团队秘境】 "+"\n"+groupData[2]) 
            }else{
                room.say("大侠好！~( ´∀` )~"+"\n"+
                    "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
                    "【秘境大战】 "+dailyData.war+"\n"+
                    "【今日战场】 "+dailyData.battle+"\n"+
                    "【阵营任务】 "+dailyData.camp+"\n"+"\n"+
                    "【武林通鉴·公共任务】 "+"\n"+groupData[0]+"\n"+
                    "【武林通鉴·秘境任务】 "+"\n"+groupData[1]+"\n"+
                    "【武林通鉴·团队秘境】 "+"\n"+groupData[2]) 
            }
            
            await sleep(1000);
            
        }
        if(text === '骚话'){
            const randomMessage = await getRandom();
            const randomData = randomMessage.data.data
            room.say(randomData.text) 
        }
        if(text === '舔狗'){
            const randomMessage = await getReRandom();
            const randomData = randomMessage.data.data
            room.say(randomData.text) 
        }
        if(/前置 /.test(text) && text.startsWith('前置')){
            const name = text.substring(3);
            const requireMessage = await getRequire(name);
            const requireData = requireMessage.data.data
            const fileName = await getImage(requireData.url);
        
            const mediaId = fileName.return
            const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
            const fileUrl = 'http://ljh.yangdagang.com/pictures/'+mediaId+'.gif';
            room.say('奇遇名称：'+requireData.name+"\n"+
            '前置条件：'+requireData.means+"\n"+
            '触发方式：'+requireData.require+"\n"+
            '奇遇奖励：'+requireData.reward) 
            room.say(fileBox)
        }
        if(/攻略 /.test(text) && text.startsWith('攻略')){
            const name = text.substring(3);
            const requireMessage = await getStrategy(name);
            const requireData = requireMessage.data.data
            const fileName = await getImage(requireData.url);
        
            const mediaId = fileName.return
            const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
            const fileUrl = 'http://ljh.yangdagang.com/pictures/'+mediaId+'.gif';
            room.say('奇遇名称：'+requireData.name+"\n"+
            '奇遇类别：'+requireData.class+"\n"+
            '奇遇等级：'+requireData.level+"\n"+
            '攻略内容：'+fileUrl+"\n"+
            '更新时间：'+requireData.time) 
            room.say(fileBox)
            await sleep(1000);
        }
        if(text === '开服'){
            const name = "破阵子";
            const requireMessage = await getCheck(name);
            const requireData = requireMessage.data.data
            
            console.log(requireData)
            if(requireData.status === 0){
                room.say("念破  维护中")
            }
            if(requireData.status === 1){
                room.say("念破  已开服")
            }
        
        }
        if(/名剑战绩 /.test(text) && text.startsWith('名剑战绩')){
            const server = '破阵子';
            const mode = text.split(' ')[1];
            const name = text.split(' ')[2];
            const requireMessage = await getRecent(server,mode,name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 412){
                room.say('该角色战绩未公开')
            }if(requireMessage.data.code === 404){
                room.say('该角色信息未收录')
            }
            
        
        }
        if(/物价 /.test(text) && text.startsWith('物价')){
            const name = text.substring(3);
            const requireMessage = await getPrice(name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 404){
                room.say('该物品信息未收录')
            }
            
        }
        if(/奇遇 /.test(text) && text.startsWith('奇遇')){
            let server = '破阵子';
            let name = text.substring(3);
            if(/ /.test(name)){
                server = name.split(' ')[0];
                name = name.split(' ')[1];
            }
            const requireMessage = await getSerendipity(server,name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 404){
                room.say('该角色信息未收录')
            }
            
        }
        if(/统计 /.test(text) && text.startsWith('统计')){
            let server = '破阵子';
            let name = text.substring(3);
            if(/ /.test(name)){
                server = name.split(' ')[0];
                name = name.split(' ')[1];
            }
            const requireMessage = await getStatistical(server,name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }
            
        }
        if(text === '金价'){
            const server = '破阵子';
            const requireMessage = await getDemon(server);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }
        }
        if(/查询 /.test(text) && text.startsWith('查询')){
            let server = '破阵子';
            let name = text.substring(3);
            if(/ /.test(name)){
                server = name.split(' ')[0];
                name = name.split(' ')[1];
            }
            const requireMessage = await getAttribute(server,name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 404){
                room.say('该角色信息未收录')
            }
        }
        if(/烟花 /.test(text) && text.startsWith('烟花')){
            let server = '破阵子';
            let name = text.substring(3);
            if(/ /.test(name)){
                server = name.split(' ')[0];
                name = name.split(' ')[1];
            }
            const requireMessage = await getFirework(server,name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 404){
                room.say('该角色信息未收录')
            }
            
        }
        if(/团队 /.test(text) && text.startsWith('团队')){
            let server = '破阵子';
            let name = text.substring(3);
            if(/ /.test(name)){
                server = name.split(' ')[0];
                name = name.split(' ')[1];
            }
            const requireMessage = await getRecruit(server,name);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 404){
                room.say('该副本信息不存在')
            }
            
        }
        if(/榜单 /.test(text) && text.startsWith('榜单')){
            let server = '破阵子';
            let name = text.substring(3);
            if(/ /.test(name)){
                server = name.split(' ')[0];
                name = name.split(' ')[1];
            }
            name = name + '五十强';
            const requireMessage = await getExcellent(name,server);
            const requireData = requireMessage.data.data
            if(requireMessage.data.code === 200){
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
            }if(requireMessage.data.code === 404){
                room.say('未收录此信息')
            }
            
        }
        if(/刷马 /.test(text)  && text.startsWith('刷马')){
            const name = text.substring(3);
            const requireMessage = await getHorse(name);
            const requireData = requireMessage.data.data.data

            requireData.forEach(async(val) => {
                room.say(val.name+"\n"+
                    "地图："+val.map+"\n"+
                    "位置："+val.url) 
            })
        }
        if(/新闻 /.test(text) && text.startsWith('新闻')){
            const name = text.substring(3);
            const requireMessage = await getNews(name);
            const requireData = requireMessage.data.data

            requireData.forEach(async(val) => {
                room.say(val.type+"\n"+
                    "标题："+val.title+"\n"+
                    "日期："+val.date+"\n"+
                    "链接："+val.url) 
                await sleep(1000);
                const requireMessage = await getViewNews(val.url);
                const requireData = requireMessage.data.data
                const fileName = await getImage(requireData.url);
        
                const mediaId = fileName.return
                const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
                room.say(fileBox)
                
            })
        
        }
        if(text === '原神角色'){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a1.jpg`);
            room.say(role1) 
            await sleep(1000);
            const role2 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a2.jpg`);
            room.say(role2) 
            await sleep(1000);
            const role3 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a3.jpg`);
            room.say(role3) 
        }
        if(text === '精炼'){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a4.jpg`);
            room.say(role1) 
            await sleep(1000);
            const role2 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a5.jpg`);
            room.say(role2) 
        }
        if(text === '蹲宠'){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a6.jpg`);
            room.say(role1) 
        }
        if(text === '小药'){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a7.jpg`);
            room.say(role1) 
        }
        
        if(/原神材料/.test(text)){
            room.say(new UrlLink(commonInfoUrl))
        }
		if(text === '开启表情包转换'){
            const id = room.id

            const checkroompurviewsql = "update roompurview set totalpurview = 'Y' where roomId = '"+id+"'";
            await query(checkroompurviewsql);
            room.say('表情包转换开启成功')
         }
         if(text === '关闭表情包转换'){
            const id = room.id

            const checkroompurviewsql = "update roompurview set totalpurview = 'N' where roomId = '"+id+"'";
            await query(checkroompurviewsql);
            room.say('表情包转换关闭成功')
         }
        if(/定时任务/.test(text) && text.startsWith('定时任务')){
            await room.sync()
            const contact3 = message.talker().name()
            const contactid = message.talker().id
            const id = room.id

            const content = contact3 + '|' + id + '|' +text
            console.log(content)
            const timestamp = await getTimer(content); 

            // 为了不改后面项目改造成更新字段
            const updatewechatIDsql = "update timerremindinfo set wechatID = '"+contactid+"',Remind_Sign = '1' where TimeStamp = '"+timestamp.return+"'";
            await query(updatewechatIDsql);

            await onToPublicmethodReminded(timestamp.return);
            const members = await room.member({name: contact3}) 
            room.say('您的定时任务已经配置成功',members)
        }
        if(text === '房间id'){
            const id = room.id
            console.log(id)
            const topic = await room.topic()
            console.log(`room topic is : ${topic}`)
            room.say(id)
            await sleep(1000);
            room.say(`${topic}`)
        }
        if(text === 'git命令'){
            const id = `
            git pull origin main
            git add .
            git commit -m ""
            git push -u origin master
            
            清除本地缓存： git rm -r --cached .
            撤销commit及add :  git reset --mixed HEAD^
            撤销commit：  git reset --soft HEAD^
            
            git branch
            git list
            git status
            git checkout -b 分支名
            `
            room.say(id)
            await sleep(1000);
        }
        if(text === '表格拆分'){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/biaogechaifen.xlsm`);
            room.say(role1) 
        }
        if(text === '查询任务'){
            const date = dayjs().format('YYYY-MM-DD')
            
            const contact3 = message.talker().id

            const sql = "select count(TimeStamp) count from timerremindinfo where Remind_Date >= '"+date+"' and wechatid = '"+contact3+"'";
            
            const countJson = await query(sql);

            if(countJson[0].count === 0){
                room.say('未查询到定时任务')
            }else{
                
                const timeStampSql = "select TimeStamp from timerremindinfo where Remind_Date >= '"+date+"' and wechatid = '"+contact3+"'";

                const timeStampJson = await query(timeStampSql);

                var message = ""

                for(let i = 0;i < countJson[0].count;i++){
                    const messageSql = "select TimeStamp,username,message,Remind_Date,Remind_Time from timerremindinfo where TimeStamp = '"+timeStampJson[i].TimeStamp+"'";
                    const messageJson = await query(messageSql);

                    message = message + "编号：" + messageJson[0].TimeStamp+ "  " + "时间："+ dayjs(messageJson[0].Remind_Date).format('YYYY-MM-DD') + "  "+ messageJson[0].Remind_Time + "  " +"内容：" + messageJson[0].message + "  " + "\n"
                
                    console.log(message)
                }
                message = message + "\n\n如需删除定时任务请输入：删除任务+编号"

                room.say(message)
            }

            
            
        }
        if(/删除任务/.test(text) && text.startsWith('删除任务')){
            const contact3 = message.talker().id
            const timeStamp = text.substring(4);
            // 先校验是否为本人删除任务
            const sql = "select wechatid from timerremindinfo where TimeStamp = '"+timeStamp+"'";
            const wechatIDJson = await query(sql);

            if(wechatIDJson[0].wechatid === contact3){
                const deleteTimeInfosql = "delete from timerremindinfo where TimeStamp = '"+timeStamp+"'";
                await query(deleteTimeInfosql);
                room.say('删除任务成功')
            }else{
                room.say('不可删除其他用户定时任务')
            }

            
        }

        // 当需要测试时再打开
        // if(/测试/.test(text)){
        //     const contact = await bot.bot.Contact.find('齐荼');
        //     await contact.say('这里是打卡第二次提醒，请不要忘记打卡。')
        // }
    }   
}


/**
 * 表情包转换图片路径
 * @param message {Class} 消息实例
 * 
 */
 async function onEmojiToImage(message) {
    let return_text = message.text().replace(/\s/g,"").replace(/&amp;/g, "&");
    let url;
    if (return_text.indexOf('emoji') > -1 ) {
        url = return_text.split('cdnurl=')[1].split('designerid')[0];
        url = url.substring(1, url.length - 1);
        await message.say('正在转换表情包，请稍候(目前预览仅支持静态表情包，动态表情包如需预览保存请点击链接)');
        const fileName = await getImage(url);
        
        await sleep(1000);   //暂停1秒
        const mediaId = fileName.return
        const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/${mediaId}.gif`);
        const fileUrl = 'http://ljh.yangdagang.com/pictures/'+mediaId+'.gif';
        await message.say(fileBox);
        await sleep(1000);   //暂停1秒
        await message.say(fileUrl);
        
    }
}
export default onReply;
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
import {getDaily,getDemon,getRandom,getReRandom,getRequire,getStrategy,getPrice,getQixue,getMacro,getNews,getHorse,getCheck} from './JX3Interface.js';
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
        if(/当前时间/.test(text)){
            console.log(dayjs().format('YYYY-MM-DD HH:mm:ss SSS')) 
            room.say(dayjs().format('YYYY-MM-DD HH:mm:ss'))
        }
        if(/随机图片/.test(text)){
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
        if(/天气/.test(text)){
            const city = text.substring(0, text.length - 2);
            console.log(city)
            const weatherMessage = await getWeather(city);
            const weatherInfo = eval('/'+city+'/')
            if(weatherInfo.test(weatherMessage.return)){
                room.say(weatherMessage.return) 
            }else{
                room.say('未查到需要的天气记录，天气查询格式应为: XX天气    XX为所查询的城市名称')
            }
            
        }
        if(/日常/.test(text) && text.startsWith('日常')){
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
        if(/金价/.test(text)){
            const server = '破阵子';
            const demonMessage = await getDemon(server);
            const demonData = demonMessage.data.data
            demonData.forEach(async(val) => {

                const date = new Date(val.time* 1000)
                const time = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;
                
                const today = dayjs().format('YYYY-MM-DD');

                const daybetween = dayjs(today).diff(time,'day') 
                if(daybetween === 1){
                    await room.say("时间："+time+"\n"+
                    "服务器："+val.server+"\n"+
                    "万宝楼："+val.wanbaolou+"\n"+
                    "贴吧："+val.tieba+"\n"+
                    "dd373："+val.dd373+"\n"+
                    "uu898："+val.uu898+"\n"+
                    "5173："+val['5173']+"\n"+
                    "7881："+val['7881']) 
                 }
                
                
            })
        }
        if(/骚话/.test(text) && text.startsWith('骚话')){
            const randomMessage = await getRandom();
            const randomData = randomMessage.data.data
            room.say(randomData.text) 
        }
        if(/舔狗/.test(text) && text.startsWith('舔狗')){
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
        if(/物价 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getPrice(name);
            const requireData = requireMessage.data.data
            room.say('商品名称：'+requireData.name+"\n"+
            '商品介绍：'+requireData.info+"\n"+
            '图片信息：'+requireData.url) 
            const requireResultData = requireData.data
            
            await sleep(1000);
            // 数组中1为双线一区念破，所以直接取其值
            requireResultData[1].forEach(async(val) => {
                if(val.server === '破阵子'){
                    room.say("大区："+val.zone+"\n"+
                        "服务器："+val.server+"\n"+
                        "类别："+val.class+"\n"+
                        "更新时间："+val.date+"\n"+
                        "收付方式："+val.sales+"\n"+
                        "金额："+val.value) 
                        await sleep(1000);
                }
                
            })
            
        }

        if(/奇穴 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getQixue(name);
            const requireData = requireMessage.data.data
            room.say('心法名称：'+requireData.name+"\n"+
            '战场任务：'+requireData.master+"\n"+
            '龙门绝境：'+requireData.longmen+"\n"+
            'pvp：'+requireData.battle+"\n"+
            '更新时间：'+requireData.time) 
            await sleep(1000);
        
        }
        if(/宏 /.test(text)){
            const name = text.substring(2);
            const requireMessage = await getMacro(name);
            const requireData = requireMessage.data.data
            room.say('心法名称：'+requireData.name+"\n"+
            '奇穴：'+requireData.qixue+"\n"+
            '宏命令：'+requireData.macro+"\n"+
            '更新时间：'+requireData.time) 
            await sleep(1000);
        
        }
        
        if(/开服/.test(text) && text.startsWith('开服')){
            const name = "破阵子";
            const requireMessage = await getCheck(name);
            const requireData = requireMessage.data.data
            if(requireData.status === '维护'){
                room.say("念破  维护中")
            }
            if(requireData.status === '正常'){
                room.say("念破  已开服")
            }
        
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
                
            })
        
        }
        if(/原神角色/.test(text) && text.startsWith('原神角色')){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a1.jpg`);
            room.say(role1) 
            await sleep(1000);
            const role2 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a2.jpg`);
            room.say(role2) 
            await sleep(1000);
            const role3 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a3.jpg`);
            room.say(role3) 
        }
        if(/精炼/.test(text) && text.startsWith('精炼')){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a4.jpg`);
            room.say(role1) 
            await sleep(1000);
            const role2 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a5.jpg`);
            room.say(role2) 
        }
        if(/蹲宠/.test(text) && text.startsWith('蹲宠')){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a6.jpg`);
            room.say(role1) 
        }
        if(/小药/.test(text)  && text.startsWith('小药')){
            // const name = text.substring(3);
            // const requireMessage = await getHeighten(name);
            // const requireData = requireMessage.data.data
            // room.say('心法名称：'+requireData.name+"\n"+
            // requireData.heighten_food+"\n"+
            // requireData.auxiliary_food+"\n"+
            // requireData.heighten_drug+"\n"+
            // requireData.auxiliary_drug) 
            // await sleep(1000);
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a7.jpg`);
            room.say(role1) 

        
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
        if(/原神材料/.test(text)){
            room.say(new UrlLink(commonInfoUrl))
        }
		if(/开启表情包转换/.test(text)){
            const id = room.id

            const checkroompurviewsql = "update roompurview set totalpurview = 'Y' where roomId = '"+id+"'";
            await query(checkroompurviewsql);
            room.say('表情包转换开启成功')
         }
         if(/关闭表情包转换/.test(text)){
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
        if(/房间id/.test(text)){
            const id = room.id
            console.log(id)
            const topic = await room.topic()
            console.log(`room topic is : ${topic}`)
            room.say(id)
            await sleep(1000);
            room.say(`${topic}`)
        }
        if(/git/.test(text) && text.startsWith('git')){
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
        if(/表格拆分/.test(text) && text.startsWith('表格拆分')){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/biaogechaifen.xlsm`);
            room.say(role1) 
        }
        if(/查询任务/.test(text) && text.startsWith('查询任务')){
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
        // if(/@secret./.test(text)){
        //     const message = text.substring(8);
        //     const reply = getreply(message)
            
        //     reply.then(
        //         (data) => {
        //           console.log(data);
        //           room.say(data.Reply)
        //         },
        //         (err) => {
        //           console.error("error", err);
        //         }
        //     )

            
        // } 



        // 当需要测试时再打开
        // if(/测试/.test(text)){
        //     console.log(message.talker())

        //     const contact3 = message.talker().name()

        //     console.log(contact3)

        //     const contact = message.talker().id

        //     console.log(contact)


            
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
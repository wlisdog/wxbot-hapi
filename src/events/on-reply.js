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
import {getDaily,getDemon,getRandom,getReRandom,getRequire,getStrategy,getPrice,getPrices,getQixue,getMacro,getHeighten} from './JX3Interface.js';
// import {getreply} from './nlpchatInterface.js';
import query from './testMySQL.js';
import {onToPublicmethodReminded } from "../plugins/schedule/index.js";

const rootListArr = [ "YHL.", "S"] 

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
        if(/日常/.test(text)){
            const server = '破阵子';
            const next = '0';
            const dailyMessage = await getDaily(server,next);
            console.log(dailyMessage.data.data.team)
            const dailyData = dailyMessage.data.data
            const groupData = dailyData.team
            const sql = "select * from dateinfo where date = '"+dailyData.date+"'";
            const messageJson = await query(sql);

            if(dailyData.draw){
                room.say("大侠好！~( ´∀` )~"+"\n"+
                    "今天是"+messageJson[0].dateformat+"，"+"星期"+dailyData.week+"\n"+
                    "【秘境大战】 "+dailyData.war+"\n"+
                    "【今日战场】 "+dailyData.battle+"\n"+
                    "【公共任务】 "+dailyData.public+"\n"+
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
                    "【公共任务】 "+dailyData.public+"\n"+
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
        if(/骚话/.test(text)){
            const randomMessage = await getRandom();
            const randomData = randomMessage.data.data
            room.say(randomData.text) 
        }
        if(/舔狗/.test(text)){
            const randomMessage = await getReRandom();
            const randomData = randomMessage.data.data
            room.say(randomData.text) 
        }
        if(/前置 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getRequire(name);
            const requireData = requireMessage.data.data
            room.say('奇遇名称：'+requireData.name+"\n"+
            '前置条件：'+requireData.means+"\n"+
            '触发方式：'+requireData.require+"\n"+
            '奇遇奖励：'+requireData.reward+"\n"+
            '一图流：'+requireData.upload) 
            await sleep(1000);
        }
        if(/攻略 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getStrategy(name);
            const requireData = requireMessage.data.data
            room.say('奇遇名称：'+requireData.name+"\n"+
            '奇遇类别：'+requireData.class+"\n"+
            '奇遇等级：'+requireData.level+"\n"+
            '攻略内容：'+requireData.url+"\n"+
            '更新时间：'+requireData.time) 
            await sleep(1000);
        }
        if(/物价 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getPrice(name);
            const requireData = requireMessage.data.data
            room.say('商品名称：'+requireData.name+"\n"+
            '商品介绍：'+requireData.info+"\n"+
            '图片信息：'+requireData.upload) 
            const requireResultData = requireData.data
            
            console.log(requireResultData)
            await sleep(1000);
            // 数组中1为双线一区念破，所以直接取其值
            requireResultData[1].forEach(async(val) => {
                if(val.server === '破阵子'){
                    room.say("大区："+val.zone+"\n"+
                        "服务器："+val.server+"\n"+
                        "类别："+val.class+"\n"+
                        "更新时间："+val.date+"\n"+
                        "收付方式："+val.sale+"\n"+
                        "金额："+val.value) 
                        await sleep(1000);
                }
                
            })
            
        }

        if(/价格 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getPrices(name);
            const requireData = requireMessage.data.data
            // 数组中1为双线一区，所以直接取其值
            requireData[1].forEach(async(val) => {
                room.say("服务器："+val.fwq+"\n"+
                "物品名称："+val.wpmc+"\n"+
                "物品别称："+val.wpqc+"\n"+
                "部位："+val.lb+"\n"+
                "细类："+val.xl+"\n"+
                "价格："+val.jg+"\n"+
                "报价时间："+val.bjsj+"\n"+
                "方式："+val.lx) 
                await sleep(1000);
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
        if(/小药 /.test(text)){
            const name = text.substring(3);
            const requireMessage = await getHeighten(name);
            const requireData = requireMessage.data.data
            room.say('心法名称：'+requireData.name+"\n"+
            requireData.heighten_food+"\n"+
            requireData.auxiliary_food+"\n"+
            requireData.heighten_drug+"\n"+
            requireData.auxiliary_drug) 
            await sleep(1000);
        
        }
        if(/材料 /.test(text)){
            const name = text.substring(3);
            const material = name.split(' ')[0]
            const map = name.split(' ')[1]
            const materialsql = "select code from basiscode where codetype = 'Material' and codename = '"+material+"'";
            const materialJson = await query(materialsql);
            const mapsql = "select code from basiscode where codetype = 'Map' and codename = '"+map+"'";
            const mapJson = await query(mapsql);
            console.log(materialJson[0].code)
            console.log(mapJson[0].code)
            const mediaId = materialJson[0].code + mapJson[0].code
            console.log(mediaId)

            const fileBox = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/aa${mediaId}.jpg`);
            room.say(fileBox) 
        
        }
        if(/原神角色/.test(text)){
            const role1 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a1.jpg`);
            room.say(role1) 
            await sleep(1000);
            const role2 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a2.jpg`);
            room.say(role2) 
            await sleep(1000);
            const role3 = FileBox.fromUrl(`http://ljh.yangdagang.com/pictures/a3.jpg`);
            room.say(role3) 
        }
        if(/原神材料/.test(text)){
            room.say(new UrlLink(commonInfoUrl))
        }
		if(/账号id/.test(text)){
            room.say('19538887215')
         }
        if(/定时任务/.test(text)){
            await room.sync()
            const contact3 = message.talker().name()
            const id = room.id

            const content = contact3 + '|' + id + '|' +text
            console.log(content)
            const timestamp = await getTimer(content); 
            
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
        if(/git/.test(text)){
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
            console.log(id)
            room.say(id)
            await sleep(1000);
        }
        // if(/@secret. /.test(text)){
        //     const message = text.substring(9);
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
        if(/测试/.test(text)){
            // const message = text.substring(9);
            // const reply = getreply(message)
            
            // reply.then(
            //     (data) => {
            //       console.log(data);
            //       room.say(data.Reply)
            //     },
            //     (err) => {
            //       console.error("error", err);
            //     }
            // )

            
        }
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
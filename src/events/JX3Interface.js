import axios from 'axios';

/**
 * @author Srecko
 * @desc: 剑网3接口调用
 * @date 2022-4-11  
 * 凌霄揽胜，雪藏英才。秉坚忍之心，行国士之事，不问青史，不计浮沉。
 */


/**
 * 日常任务
 * @desc 今天、明天、后天等的日常任务，七点自动更新。
 * @param server 区服名称，预测该区服的美人图；
 * @param num 预测时间，预测指定时间的日常；默认值 : 0。
 */
async function getDaily(server,num) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/data/active/current', {
            server: server,
            num: num
          })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            console.log(error);
            reject()
          });
    });
}

/**
 * 金币比例
 * @desc 检查近十天的金价比例，数据仅供参考。
 * @param server 用于返回目标服务器平均金价比例，当输入空参数时，返回全部服务器，默认空（返回全部服务器比例）。
 */
async function getDemon(server) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/view/trade/demon', {
            server: server,
            limit: 10,
            robot: 'secret.',
            cache: 1,
            token: 'k5q7j5azzanqg5bwow'
          })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            console.log(error);
            reject()
          });
    });
}

/**
 * 随机骚话
 * @desc 召唤一条骚话。
 */
async function getRandom() {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/data/chat/random', {
          })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            console.log(error);
            reject()
          });
    });
}

/**
 * 奇遇前置
 * @desc 搜索目标奇遇的前置要求。
 * @param name 输入奇遇名称，搜索前置要求。
 */
async function getRequire(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/data/lucky/sub/require', {
            name: name,
          })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            console.log(error);
            reject()
          });
    });
}


/**
 * 奇遇攻略
 * @desc 搜索某个奇遇的任务攻略。
 * @param name 输入奇遇名称，搜索详细任务流程，不支持搜索宠物攻略。
 */
 async function getStrategy(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/data/lucky/sub/strategy', {
            name: name
          })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            console.log(error);
            reject()
          });
    });
}


/**
 * 物价信息
 * @desc 搜索黑市的外观物品最新价格。
 * @param name 物品名称，查询指定物品的价格信息。
 * @param token 站点标识，检查请求权限。
 */
 async function getPrice(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/view/trade/search', {
            name: name,
            token: 'k5q7j5azzanqg5bwow',
            robot: 'secret.',
            cache: 1
          })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            console.log(error);
            reject()
          });
    });
}




/**
 * 舔狗日志
 * @desc 召唤一条舔狗日志。
 */
 async function getReRandom() {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/data/useless/flatterer', {
        
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}


/**
 * 官方资讯
 * @desc 搜索官方近期发布的最新公告，新闻等相关内容。
 * @param limit 限制返回数量，可选范围1-50。
 */
 async function getNews(limit) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/data/web/news', {
          limit: limit
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 刷新地点
 * @desc 搜索某个地图刷新的马驹名称和刷新位置。
 * @param name 地图名称/马驹名称，搜索该地图出现的马驹或搜索该马驹出现的地图。
 */
 async function getHorse(name) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/app/horse', {
          name: name
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 开服检查
 * @desc 检查目标服务器的开服状态，可用于开服监控。
 * @param server  区服名称，支持体验服和缘起大区，查询指定区服的开服状态；
 */
 async function getCheck(server) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/data/server/check', {
          server: server
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 名剑战绩
 * @desc 角色近期战绩记录
 * @param server  区服名称
 * @param name  角色名称
 * @param mode  竞技场类型，支持22、33、55
 * @param robot  机器人名称
 * @param ticket  推栏抓包token
 * @param token 站点标识，检查请求权限。
 */
 async function getRecent(server,mode,name) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/arena/recent', {
          server: server,
          name: name,
          mode: mode,
          robot: 'secret.',
          ticket: 'f578b36ba782426793e6975290d5fda0:l1464782906:kingsoft::4BgNG67NcUH+Qsnt3qIv0A==',
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 角色奇遇
 * @desc 角色奇遇触发记录(不保证遗漏)
 * @param server  区服名称
 * @param name  角色名称
 * @param robot  机器人名称
 * @param ticket  推栏抓包token
 * @param token 站点标识，检查请求权限。
 */
 async function getSerendipity(server,name) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/lucky/serendipity', {
          server: server,
          name: name,
          robot: 'secret.',
          ticket: 'f578b36ba782426793e6975290d5fda0:l1464782906:kingsoft::4BgNG67NcUH+Qsnt3qIv0A==',
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}


/**
 * 奇遇统计
 * @desc 统计奇遇近期触发角色记录
 * @param server  区服名称
 * @param name  角色名称
 * @param limit  条数
 * @param robot  机器人名称
 * @param cache  缓存模式，缓存模式下有效提高返回速度，可选范围[0-1]，默认值 : 1。
 * @param token 站点标识，检查请求权限。
 */
 async function getStatistical(server,name) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/lucky/statistical', {
          server: server,
          name: name,
          limit: 10,
          robot: 'secret.',
          cache: 1,
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 装备属性
 * @desc 角色装备属性详情
 * @param server  区服名称
 * @param name  角色名称
 * @param cache  缓存模式，缓存模式下有效提高返回速度，可选范围[0-1]，默认值 : 1；
 * @param robot  机器人名称
 * @param ticket  推栏抓包token
 * @param token 站点标识，检查请求权限。
 */
 async function getAttribute(server,name) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/role/attribute', {
          server: server,
          name: name,
          cache: 1,
          robot: 'secret.',
          ticket: 'f578b36ba782426793e6975290d5fda0:l1464782906:kingsoft::4BgNG67NcUH+Qsnt3qIv0A==',
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 烟花记录
 * @desc 角色烟花燃放记录
 * @param server  区服名称
 * @param name  角色名称
 * @param cache  缓存模式，缓存模式下有效提高返回速度，可选范围[0-1]，默认值 : 1；
 * @param robot  机器人名称
 * @param token 站点标识，检查请求权限。
 */
 async function getFirework(server,name) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/role/firework', {
          server: server,
          name: name,
          cache: 1,
          robot: 'secret.',
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 新闻资讯
 * @desc 新闻资讯图片合成
 * @param url  新闻资讯或维护公告链接，截图指定页面；
 * @param token 站点标识，检查请求权限。
 */
 async function getViewNews(url) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/web/news', {
          url: url,
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 团队招募
 * @desc 团队招募信息
 * @param server  区服名称，筛选记录；
 * @param keyword  关键字，筛选团长名称，活动名称，招募信息；
 * @param robot  机器人名称，图片底部水印生成；
 * @param cache  缓存模式，缓存模式下有效提高返回速度，可选范围[0-1]，默认值 : 1；
 * @param token 站点标识，检查请求权限。
 */
 async function getRecruit(server,keyword) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/team/member/recruit', {
          server: server,
          keyword: keyword,
          cache: 1,
          robot: 'secret.',
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

/**
 * 战功榜单
 * @desc 客户端战功榜单
 * @param type 榜单类型，可选范围[赛季恶人五十强 赛季浩气五十强 上周恶人五十强 上周浩气五十强 本周恶人五十强 本周浩气五十强]；
 * @param server  区服名称，筛选记录；
 * @param cache  缓存模式，缓存模式下有效提高返回速度，可选范围[0-1]，默认值 : 1；
 * @param robot  机器人名称，图片底部水印生成；
 * @param token 站点标识，检查请求权限。
 */
 async function getExcellent(type,server) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/view/rank/excellent', {
          type: type,
          server: server,
          cache: 1,
          robot: 'secret.',
          token: 'k5q7j5azzanqg5bwow'
        })
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          console.log(error);
          reject()
        });
  });
}

export  {
    getDaily,
    getDemon,
    getRandom,
    getRequire,
    getStrategy,
    getPrice,
    getReRandom,
    getNews,
    getHorse,
    getCheck,
    getRecent,
    getSerendipity,
    getStatistical,
    getAttribute,
    getFirework,
    getViewNews,
    getRecruit,
    getExcellent
  };
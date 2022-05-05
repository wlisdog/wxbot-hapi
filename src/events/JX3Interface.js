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
 * @param server 用于返回目标服务器当天美人图，默认空（不返回美人图）
 * @param next 用于查询第几天日常，可选范围：0-3，默认值0(当天)。
 */
async function getDaily(server,next) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/daily', {
            server: server,
            next: next
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
 * 金价比例
 * @desc 检查近十天的金价比例，数据仅供参考。
 * @param server 用于返回目标服务器平均金价比例，当输入空参数时，返回全部服务器，默认空（返回全部服务器比例）。
 */
async function getDemon(server) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/demon', {
            server: server,
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
        axios.post('https://www.jx3api.com/app/random', {
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
        axios.post('https://www.jx3api.com/app/require', {
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
        axios.post('https://www.jx3api.com/app/strategy', {
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
 * @param name 输入物品/外观名称，搜索黑市最新价格。
 */
 async function getPrice(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/price', {
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
 * 价格信息
 * @desc 搜索黑市的外观物品最新价格，数据来源于废牛助手。
 * @param name 输入物品/外观名称，搜索黑市最新价格。
 */
 async function getPrices(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/prices', {
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
 * 推荐奇穴
 * @desc 推荐当前赛季所使用的奇穴。
 * @param name 输入心法名称，搜索当前赛季热门奇穴。
 */
 async function getQixue(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/qixue', {
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
 * 查宏命令
 * @desc 推荐当前赛季热门的宏命令。
 * @param name 输入心法名称，搜索当前赛季热门奇穴。
 */
 async function getMacro(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/macro', {
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
 * 推荐小药
 * @desc 推荐当前赛季所使用的小吃小药。
 * @param name 输入心法名称，搜索当前赛季推荐小药。
 */
 async function getHeighten(name) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/app/heighten', {
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
 * 舔狗日志
 * @desc 召唤一条舔狗日志。
 */
 async function getReRandom() {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/realize/random', {
        
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
      axios.post('https://www.jx3api.com/app/news', {
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
 * 开服检查
 * @desc 检查目标服务器的开服状态，可用于开服监控。
 * @param server 用于返回目标服务器开服状态，当输入空参数或错误参数时，返回全部服务器，默认空（返回全部服务器状态）。
 */
 async function getCheck(server) {
  return new Promise((resolve,reject)=>{
      axios.post('https://www.jx3api.com/app/check', {
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

export  {
    getDaily,
    getDemon,
    getRandom,
    getRequire,
    getStrategy,
    getPrice,
    getPrices,
    getQixue,
    getMacro,
    getHeighten,
    getReRandom,
    getNews,
    getCheck
  };
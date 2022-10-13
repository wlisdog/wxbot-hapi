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
 * 金价比例
 * @desc 检查近十天的金价比例，数据仅供参考。
 * @param server 用于返回目标服务器平均金价比例，当输入空参数时，返回全部服务器，默认空（返回全部服务器比例）。
 */
async function getDemon(server) {
    return new Promise((resolve,reject)=>{
        axios.post('https://www.jx3api.com/data/trade/demon', {
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
        axios.post('https://www.jx3api.com/data/trade/search', {
            name: name,
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

export  {
    getDaily,
    getDemon,
    getRandom,
    getRequire,
    getStrategy,
    getPrice,
    getQixue,
    getMacro,
    getHeighten,
    getReRandom,
    getNews,
    getHorse,
    getCheck
  };
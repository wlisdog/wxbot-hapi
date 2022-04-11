import axios from 'axios';

var url = 'https://www.jx3api.com/app/daily';
var url2 = 'https://www.jx3api.com/app/demon';
var url3 = 'https://www.jx3api.com/app/random';
var url4 = 'https://www.jx3api.com/app/require';


async function getDaily(server,next) {
    return new Promise((resolve,reject)=>{
        axios.post(url, {
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

async function getDemon(server) {
    return new Promise((resolve,reject)=>{
        axios.post(url2, {
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

async function getRandom() {
    return new Promise((resolve,reject)=>{
        axios.post(url3, {
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

async function getRequire(name) {
    return new Promise((resolve,reject)=>{
        axios.post(url4, {
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

export  {
    getDaily,
    getDemon,
    getRandom,
    getRequire
  };
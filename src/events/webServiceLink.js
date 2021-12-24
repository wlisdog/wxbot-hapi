import soap from 'soap';

var url = 'http://ljh.yangdagang.com/WeChatWeb/wx/core/ws?wsdl';


async function getWeather(city) {
    var args = { arg0: city};
    return new Promise((resolve,reject)=>{
        soap.createClient(url, function(err, client) {
            client.getWeather(args, function(err, result) {
                if(err){
                    console.log('query error')
                    reject()
                }else{
                    // console.log(result);
                    resolve(result)
                }
            });
            
        });
    });
}



async function getImage(httpurl) {
    var args = { arg0: httpurl};
    return new Promise((resolve,reject)=>{
        soap.createClient(url, function(err, client) {
            client.getImage(args, function(err, result) {
                if(err){
                    console.log('query error')
                    reject()
                }else{
                    // console.log(result);
                    resolve(result)
                }
            });
            
        });
    });
}
export  {
    getWeather,
    getImage
  };
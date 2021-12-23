import soap from 'soap';

var url = 'http://ljh.yangdagang.com/WeChatWeb/wx/core/ws?wsdl';


async function getWeather(city) {
    var args = { arg0: city};

     console.log(args);
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
export default getWeather;
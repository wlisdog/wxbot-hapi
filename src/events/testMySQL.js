/**
 * @author Srecko
 * @desc: 数据库连接测试
 * @date 2021-12-2
 */
import mysql from 'mysql';


async function test(sql) {

    return new Promise((resolve,reject)=>{
        
        const connection = mysql.createConnection({
            host:'49.232.164.243',
            user:'root',
            password:'2020yhlYHL',
            database:'wechat_test'
        })

        connection.query(sql,function(err,row){
            connection.end()
            if(err){
                console.log('query error')
                reject()
            }else{
                resolve(row)
            }
            
        })
    });
    
}
export default test;
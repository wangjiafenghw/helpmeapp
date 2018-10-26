var mysql=require("mysql");  
var config = require('../config/config');
var pool = mysql.createPool({  
    host: config.host,  
    user: config.user,  
    password: config.password,  
    database: config.database,  
    port: config.port 
});  
  
var query=function(sql, callback){ 
    pool.getConnection(function(err,conn){ 
        if(err){  
            conn.release();  
            callback(err,null,null);  
        }else{  
            conn.query(sql, function(err,results,fields){ 
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(err,results,fields);  
            });  
        }  
    });  
};  


  
module.exports=query;  
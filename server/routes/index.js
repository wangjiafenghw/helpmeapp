var express = require('express');
var router = express.Router();
var request = require('../utils/requset')
var sendMsg = require('../utils/sendMsg')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/helpme', (req, res)=>{
  let sql = `SELECT USERINFO.MSG,USERINFO.TEL FROM USERINFO WHERE USERINFO.\`USERNAME\`="wjf" AND USERINFO.\`PASSWORD\`="123456";`
  new Promise((resolve, reject)=>{
    request(sql, (error, results)=>{
      if(error)reject(error)
      resolve(results[0])
    })
  }).then((results)=>{
    console.log("msgData=>", results.TEL, results.MSG, req.query.position)
    sendMsg(results.TEL, results.MSG, req.query.position)
    res.send({msg: '获取短信信息成功!', code: 0, data: results})
    res.end()
  }).catch((error)=>{
    console.log(error)
  })
})

module.exports = router;

var express = require('express');
var router = express.Router();
var request = require('../utils/requset')
var hash = require('../utils/hash')

/* GET users listing. */
router.post('/setting', (req, res)=>{
  let msg = req.body.msg;
  let tel = req.body.tel;
  let token = req.cookies.token;
  let username = req.cookies.username;
  new Promise((resolve, reject)=>{
    let sql = `UPDATE USERINFO SET USERINFO.MSG="${msg}", USERINFO.TEL="${tel}" WHERE USERINFO.TOKEN="${token}" AND USERINFO.USERNAME="${username}";`
    request(sql, (error, results)=>{
      if(error)reject(error)
      resolve(results)
    })
  }).then((results)=>{
    res.send({msg: '设置成功!', code: 0})
    res.end()
  }).catch((error)=>{
    console.log(error)
  })
})
//getuserSetting
router.get('/getSetting', (req, res)=>{
  let token = req.cookies.token;
  let username = req.cookies.username;
  new Promise((resolve, reject)=>{
    let sql = `SELECT USERINFO.MSG,USERINFO.TEL FROM USERINFO WHERE USERINFO.\`TOKEN\`="${token}" AND USERINFO.USERNAME="${username}";`
    request(sql, (error, results)=>{
      if(error || results.length===0)reject(error)
      resolve(results[0])
    })
  }).then((result)=>{
    res.send({msg: '获取用户设置信息成功!', code: 0, data: result})
    res.end();
  }).catch((error)=>{
    console.log(error)
  })
})

//注册
router.post("/signUp", (req, res)=>{
	let username = req.body.username;
	let password = req.body.password;
	new Promise((resolve, reject)=>{
		let sql = `INSERT INTO HELPME.USERINFO (\`USERNAME\`,\`PASSWORD\`) VALUES ("${username}","${password}")`
		request(sql, function(error, results){
			if(error) reject(error)
			resolve();
		})
	}).then(()=>{
        res.send({msg: '注册成功!', code: 0})
        res.end();
	}).catch((error)=>{
		console.error(error)
	})
})

//登陆
router.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(username, password)
  new Promise((resolve, reject) => {
      let sql = `SELECT USERINFO.\`PASSWORD\`,USERINFO.ID FROM USERINFO WHERE USERINFO.USERNAME="${username}";`;
      request(sql, function (error, results) {
          if (error) {
              reject(error);
          }
          console.log(sql, results)
          if (results.length) {
              resolve(results[0]);
          } else {
              resolve(0);
          }
      })
  }).then((result) => {
      let pwd = result.PASSWORD;
      switch (pwd) {
          case 0:
              res.send({ msg: '用户名不存在!', code: 1 });
              res.end();
              break;
          default:
              if (pwd === password) {
                  // res.cookie('token', pwd, {
                  //   path: '/',
                  //   httpOnly: true,
                  //   maxAge: 5000000,
                  // });
                  var hash_ = hash(req.body.username+req.body.password+Date.now())
                  let sql = `UPDATE USERINFO SET USERINFO.TOKEN="${hash_}" WHERE USERINFO.USERNAME="${username}";`;
                  request(sql, function (error, results) {
                      if (error) {
                          throw error
                      }
                  })
                  res.send({ msg: '登陆成功!', code: 0, data: { "token": hash_ , "user_id": result.ID} });
                  res.end();
              } else {
                  res.send({ msg: '密码错误!', code: 2 });
                  res.end();
              }
      }
  }).catch((err) => {
      console.log(err);
  })
})

//验证是否登陆
router.get("/isLogined", (req, res) => {
  let token = req.cookies.token;
  if(typeof token === 'undefined') {
      console.log('no token')
      res.send({msg: '未登录', code: 1})
  }
  res.end()
})
module.exports = router;

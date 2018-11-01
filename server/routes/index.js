var express = require('express');
var router = express.Router();
var request = require('../utils/requset')
var sendMsg = require('../utils/sendMsg')
var multer = require("multer");
// 这里dest对应的值是你要将上传的文件存的文件夹
var upload = multer({dest:'./public/uploads'});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/helpme', (req, res)=>{
  let token = req.cookies.token;
  let username = req.cookies.username;
  let sql = `SELECT USERINFO.MSG,USERINFO.TEL FROM USERINFO WHERE USERINFO.\`USERNAME\`="${username}" AND USERINFO.\`TOKEN\`="${token}";`
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
// router.post('/upload', (req, res)=>{
//   let token = req.cookies.token;
//   let username = req.cookies.username;
//   console.log(req)
//   let sql = `UPDATE USERINFO SET USERINFO.BLOB="${req.body.data}" WHERE USERINFO.USERNAME="${username}" AND USERINFO.\`TOKEN\`="${token}";`
//   new Promise((resolve, reject)=>{
//     request(sql, (error, results)=>{
//       if(error)reject(error)
//       resolve()
//     })
//   }).then(()=>{
//     res.send({msg: '上传成功!', code: 0})
//     res.end()
//   }).catch((error)=>{
//     console.log(error)
//   })
// })
router.post("/upload", upload.single('data'),(req, res) => {
    
  // req.file 是 'file' 文件的信息 （前端传递的文件类型在req.file中获取）
  // req.body 将具有文本域数据，如果存在的话  。（上面前端代码中传递的date字段在req.body中获取）
  console.log(req.body) //{ date: '2018/1/20 下午5:25:56' }

  // ---------- 因为保存的文件为二进制，取消下面代码块注释可让保存的图片文件在本地文件夹中预览 ------
  /*
  var file_type;
  if (req.file.mimetype.split('/')[0] == 'image') file_type = '.' + req.file.mimetype.split('/')[1];
  if (file_type) {
      fs.rename(req.file.path, req.file.path + file_type, function (err, doc) {
          if (err) {
              console.error(err);
              return;
          }
          console.log('55');
          res.send('./uploads/' + req.file.filename + file_type)
      })
      return;
  }
  */
  // ---------------------
  let token = req.cookies.token;
  let username = req.cookies.username;
  let sql = `UPDATE USERINFO SET USERINFO.URL="${'./uploads/' + req.file.filename}" WHERE USERINFO.USERNAME="${username}" AND USERINFO.\`TOKEN\`="${token}";`
  new Promise((resolve, reject)=>{
    request(sql, (error, results)=>{
      if(error)reject(error)
      resolve()
    })
  }).then(()=>{
    res.send({msg: '上传成功!', code: 0, data: './uploads/' + req.file.filename})
    res.end()
  }).catch((error)=>{
    console.log(error)
  })
  // res.send('./uploads/' + req.file.filename)
})
// router.get('/getRadioUrl', (req, res)=>{
//   let sql = `SELECT USERINFO.\`URL\` FROM USERINFO WHERE TOKEN = "c2560e3cd63fd38ba84021c8c77ab410"`
//   new Promise((resolve, reject)=>{
//     request(sql, (error, results)=>{
//       if(error)reject(error)
//       resolve(results)
//     })
//   }).then((results)=>{
//     res.send(results[0].BLOB)
//     res.end()
//   }).catch((error)=>{
//     console.log(error)
//   })
// })

module.exports = router;

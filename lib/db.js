const mysql = require('mysql')
dbConfig = require('./db.config')
fs = require('fs');

class DB {

     constructor() {

          // 连接池
          var pool = mysql.createPool({
               host: dbConfig.host,
               user: dbConfig.user,
               password: dbConfig.password,
               database: dbConfig.database
          })
          // 数据库连接
          this.connection = this.init(pool);

     };

     init(pool) {

          return new Promise((reslove, reject) => {

               pool.getConnection((err, connection) => {

                    if (err) {
                         reject(err)
                    } else {
                         reslove(connection)
                    }

               })
          })
     };

     async query(sql) {

          let connection = await this.connection;

          return new Promise((reslove, reject) => {
               if (sql) {
                    connection.query(sql, (err, res) => {
                         if (err) {
                              reject(err)
                         } else {
                              reslove(res)
                         }
                    })
               } else {
                    reject('缺少参数')
               }
          })
     };

     // 文件上传
     upLoad(files) {

          var urlStr = '';
          if (files.length > 0) {

               // 遍历多个文件            
               for (let i = 0; i < files.length; i++) {

                    let file = files[i]
                    let reader = fs.createReadStream(file.path);
                    // 重命名——时间戳重命名
                    let myDate = new Date();
                    // 拿到文件的后缀
                    let temp = file.name.split('.')
                    let newFlieName = myDate.getTime() + parseInt(Math.random() * 100) + '.' + temp[temp.length - 1] //随机数，防止运行太快，时间戳相同

                    // 服务器地址--读取的是本地的 
                    // rootPath全局根路径，防止路径不对
                    let targetPath = rootPath + '/public/uploads/' + newFlieName;

                    // 创建可写入流
                    const writeFile = fs.createWriteStream(targetPath)

                    // 通过管道写入文件
                    reader.pipe(writeFile)

                    // 返回的地址 
                    urlStr += 'uploads/' + newFlieName
               }

          }

          // 判断文件名是否存在
          if (files.name) {
               let file = files;
               let reader = fs.createReadStream(file.path);
               // 重命名——时间戳重命名
               let myDate = new Date();
               // 拿到文件的后缀
               let temp = file.name.split('.')
               let newFlieName = myDate.getTime() + parseInt(Math.random() * 100) + '.' + temp[temp.length - 1] //随机数，防止运行太快，时间戳相同

               // 服务器地址--读取的是本地的 
               // rootPath全局根路径，防止路径不对
               let targetPath = rootPath + '/public/uploads/' + newFlieName;

               // 创建可写入流
               const writeFile = fs.createWriteStream(targetPath)

               // 通过管道写入文件
               reader.pipe(writeFile)

               // 返回的地址 
               urlStr = 'uploads/' + newFlieName
          }

          return urlStr
     }
}

// 实例化对象
var myDb = new DB();

// 导出
module.exports = myDb;
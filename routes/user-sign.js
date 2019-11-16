const router = require('koa-router')()
myDb = require('../lib/db')
sha1 = require('node-sha1');

// 注册 

router.post('/sign', async (ctx)=> {  

    let userInfo = ctx.request.body.userInfo;
    let name = userInfo.name;

    // 查找重名
    let findSql = `SELECT count(*) as total FROM user WHERE uname="${name}"`;
    let findRes = await myDb.query(findSql);
    
    if(findRes[0].total >0) { //重名

        console.log('用户名重复');
        ctx.body={state:false,msg:'用户名重复,请重新输入'}

    } else {
        // 不重名，进行注册
        let pwd = sha1(userInfo.pwd).substr(3,20);
        let signSql =  `INSERT INTO user (uname,upwd) VALUES ("${name}","${pwd}")`;
        let res = await myDb.query(signSql);
        // 注册成功
        if(res.affectedRows>0) {

            console.log('注册成功');
            ctx.body={state:true,msg:'注册成功...'}

        // 注册失败
        } else {
            console.log('注册失败');
            ctx.body={state:false,msg:'注册失败,请稍后再试'}
        } 
    }
})

// 登录
router.post('/login', async (ctx) => {

    // 获取ajxa提交的登录信息
    let userInfo = ctx.request.body.userInfo;

    // 密码加密
    let pwdSha1 = sha1(userInfo.pwd).substr(3, 20)
    // 通过登录信息筛选字段
    let loginSql = `SELECT count(*) as total FROM user WHERE uname="${userInfo.name}" AND upwd="${pwdSha1}"`;
    // 结果
    let res = await myDb.query(loginSql);


    // 结果为1 代表存在返回true
    if (res[0].total) {
        let token = Math.floor(Math.random()*1000000)
        let tokenSql = `UPDATE user SET token=${token} WHERE uname="${userInfo.name}"`;
        // 结果
        let tokenRes = await myDb.query(tokenSql);
        
        // token设置成功
        if( tokenRes.affectedRows >0 ) {
            
            ctx.body = {state:true,token:token}

        } else {
            ctx.body = {state:false}  
        }
       
    } else {
        // 否则false
        ctx.body = {state:false}
    }

})

// 退出页面
router.get('/exit', async (ctx)=>{
    ctx.session.admin='';
    ctx.redirect(host+'/admin')
})
module.exports = router.routes()
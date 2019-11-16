const router = require('koa-router')()
myDb = require('../lib/db')
sha1 = require('node-sha1');

router.post('/' ,  async (ctx)=> {

    let token = ctx.request.body.token;
    console.log(token)
    let findSql = `SELECT id FROM user WHERE token=${token}`;
    let res = await myDb.query(findSql);
    console.log(res)
    if( res.length > 0 ) {
        // 登录成功
        ctx.body = {state:true,id:res[0].id}
    } else {
        ctx.body ={state:false}
    }
})




module.exports = router.routes()
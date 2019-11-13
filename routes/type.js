const router = require('koa-router')()
myDb = require('../lib/db')



router.get('/', async (ctx) => {

    ctx.body = '分类'
})


router.get('/typeTitle', async (ctx) => {

    let sql = 'SELECT * FROM typetitle';
    let res = await myDb.query(sql);

    res = JSON.parse(JSON.stringify(res))

    ctx.body = res
})
//
router.get('/typeContent', async (ctx) => {

    let data =  ctx.query;

    let sql = `SELECT id,typeName FROM typetitle WHERE id =${data.typeId}`;
    let res = await myDb.query(sql);
    res = JSON.parse(JSON.stringify(res))

    let _sql = `SELECT id,typeId,comName,imgUrl FROM typecontent WHERE typeId=${data.typeId}`;
    let _res = await myDb.query(_sql);
    _res = JSON.parse(JSON.stringify(_res));
   
   
    
    let _data = {
        id:res[0].id,
        typeTitle:res[0].typeName,
        list:_res
    }
    console.log(_data)
    ctx.body = _data
})
module.exports = router.routes()
const router = require('koa-router')()
myDb = require('../lib/db')



router.get('/', async (ctx) => {

    ctx.body = '接受购物车数据'
})

// 添加商品到购物车

router.get('/addDo', async (ctx) => {

    // 获取数据，全是字符串

    let data = ctx.query;
    data = JSON.parse(JSON.stringify(data))

    let sql = `SELECT count,pid FROM shoppingcar WHERE pid=${data.id}`;
    let res = await myDb.query(sql);

    if (res.length > 0) {
        res = JSON.parse(JSON.stringify(res))

        let _count = res[0].count + Number(data.count)
        console.log(_count)

        let _sql1 = `UPDATE shoppingcar SET count = ${_count} WHERE pid =${res[0].pid}`
        let _res1 = await myDb.query(_sql1);

        if (_res1.affectedRows > 0) {

            console.log('商品存在，添加数量成功')
        } else {

            console.log('商品存在，添加数量失败')

        }
    } else {
        let _sql2 = `INSERT INTO shoppingcar (pid,pname,price,count,imgurl) VALUES (${data.id},"${data.cmmdtyTitle}",${data.price},${data.count},"${data.imgUrl}")`

        let _res2 = await myDb.query(_sql2)

        if (_res2.affectedRows > 0) {

            console.log('商品不存在，添加新商品成功')
        } else {

            console.log('商品不存在，添加新商品失败')
        }
    }

    ctx.body = true
})

// 购物车获取商品 

router.get('/getCommdty', async (ctx) => {

    let sql = `SELECT * FROM shoppingcar`;
    let res = await myDb.query(sql);
    res = JSON.parse(JSON.stringify(res))
    // console.log(res)
    ctx.body = res
})
module.exports = router.routes()
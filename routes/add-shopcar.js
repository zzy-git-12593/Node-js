const router = require('koa-router')()
myDb = require('../lib/db')



router.get('/', async (ctx) => {

    ctx.body = '接受购物车数据'
})

// 添加商品到购物车

router.post('/addDo', async (ctx) => {

    // 获取数据，全是字符串

    let data = ctx.request.body;
    data = JSON.parse(JSON.stringify(data)).params

    let sql = `SELECT count,commdtyId FROM shoppingcar WHERE commdtyId=${data.id}`;
    let res = await myDb.query(sql);

    if (res.length > 0) {
        res = JSON.parse(JSON.stringify(res))
        let _count = 0;

        // 判断数量是否为0，等于0为购物车加号添加数量
        if(data.count > 0 ) {          
            _count =  res[0].count + Number(data.count)
        } else {
            _count =  res[0].count + 1
        }

        let _sql1 = `UPDATE shoppingcar SET count = ${_count} WHERE commdtyId =${res[0].commdtyId}`
        let _res1 = await myDb.query(_sql1);

        if (_res1.affectedRows > 0) {
            // 商品详情添加，返回bool
            if(data.count > 0) {
                console.log('商品存在，商品详情添加数量成功')
                ctx.body = true
            // 购物车++，返回数据
            } else {
                // 获取数据
                let getSql = `SELECT * FROM shoppingcar`
                let getRes = await myDb.query(getSql);     
                console.log('商品存在，购物车增加数量成功')
                ctx.body = getRes
            }

        } else {
                // 商品详情添加，返回bool
                if(data.count > 0) {
                    console.log('商品存在，商品详情添加数量失败')
                    ctx.body = false
                // 购物车++，返回数据
                } else {
                    // 获取数据
                    let getSql = `SELECT * FROM shoppingcar`
                    let getRes = await myDb.query(getSql);     
                    console.log('商品存在，购物车增加数量失败')
                    ctx.body = getRes
                }
        }
    } else {
        let _sql2 = `INSERT INTO shoppingcar (commdtyId,comName,price,count,imgUrl,isBuyCheck,isDelCheck) VALUES (${data.id},"${data.commName}",${data.price},${data.count},"${data.imgUrl}",${data.isBuyCheck},${data.isDelCheck})`

        let _res2 = await myDb.query(_sql2)

        if (_res2.affectedRows > 0) {

            console.log('商品不存在，添加新商品成功')
            ctx.body = true

        } else {

            console.log('商品不存在，添加新商品失败')
            ctx.body = false
        }
    } 
})

// 购物车获取商品 

router.get('/getCommdty', async (ctx) => {

    let sql = `SELECT * FROM shoppingcar`;
    let res = await myDb.query(sql);
    res = JSON.parse(JSON.stringify(res))

    ctx.body = res
})

// 购物车数量减少
router.post('/minusDo', async (ctx)=>{

    let data = ctx.request.body.params;
    // 查询数据
    console.log(data)

    let sql = `SELECT count FROM shoppingcar WHERE commdtyId=${data.id}`;
    let res = await myDb.query(sql);
    // 是否找到
    if(res.length>0){
        // 找到数据后判断商品数量是否大于1，
        if(res[0].count > 1){
            // 大于1减减
            let _count = res[0].count-1
            let _sql1 = `UPDATE shoppingcar SET count = ${_count} WHERE commdtyId =${data.id}`
            let _res1 = await myDb.query(_sql1);
            // 返回是否修改成功
            if (_res1.affectedRows > 0) {
                // 获取数据
                let getSql = `SELECT * FROM shoppingcar`
                let getRes = await myDb.query(getSql);     
                console.log('商品存在，减少数量成功')
                ctx.body = getRes

            } else {
                // 获取数据
                let getSql = `SELECT * FROM shoppingcar`
                let getRes = await myDb.query(getSql);     
                console.log('商品不存在，减少失败')
                ctx.body = getRes

            }
        } else { //数量小于等于1 删除数据

            let DelSql = `DELETE FROM shoppingcar WHERE commdtyId =${data.id}`
            let DelRes = await myDb.query(DelSql);
            
            // 返回是否删除成功
            if (DelRes.affectedRows > 0) {
                // 获取数据
                let getSql = `SELECT * FROM shoppingcar`
                let getRes = await myDb.query(getSql);     
                console.log('商品存在，删除成功')
                ctx.body = getRes

            } else {
                // 获取数据
                let getSql = `SELECT * FROM shoppingcar`
                let getRes = await myDb.query(getSql);     
                console.log('商品存在，删除失败')
                ctx.body = getRes
            }
        }
    } else {

        ctx.body ='404，商品不存在';
    }
})

// 购物车删除/选中按钮
router.post('/check' ,async (ctx)=> {

    let data = ctx.request.body.params;
    
    if(data.checkType =='buy') {
        console.log('购买按钮',data.checkVal)
        let buySql = `UPDATE shoppingcar  SET isBuyCheck=${Number(data.checkVal)}  WHERE commdtyId=${data.id}`;
        let res = await myDb.query(buySql);
        
        if(res.affectedRows>0){
            console.log('购买修改成功');
            // 获取数据
            let getSql = `SELECT * FROM shoppingcar`
            let getRes = await myDb.query(getSql);     
            ctx.body = getRes

        } else {
            console.log('购买修改失败');
            // 获取数据
            let getSql = `SELECT * FROM shoppingcar`
            let getRes = await myDb.query(getSql);     
            ctx.body = getRes
        }
    } else {

        console.log('删除按钮',data.checkVal);

        let delSql = `UPDATE shoppingcar  SET isDelCheck=${Number(data.checkVal)}  WHERE commdtyId=${data.id}`;
        let res = await myDb.query(delSql);
        
        if(res.affectedRows>0){
            console.log('删除修改成功');
            // 获取数据
            let getSql = `SELECT * FROM shoppingcar`
            let getRes = await myDb.query(getSql);     
            ctx.body = getRes

        } else {
            console.log('删除修改失败');
            // 获取数据
            let getSql = `SELECT * FROM shoppingcar`
            let getRes = await myDb.query(getSql);     
            ctx.body = getRes
        }
    }
 

}) 


module.exports = router.routes()
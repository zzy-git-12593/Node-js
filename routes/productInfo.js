const router = require('koa-router')()
myDb = require('../lib/db')



router.get('/', async (ctx) => {

    ctx.body = '商品页面'
})

// 推荐商品列表

router.get('/recommend', async (ctx) => {
    
    let sql = 'SELECT commdty.id,cmmdtyName,imgUrl,price FROM commdty'

    let res = await myDb.query(sql);
    res = JSON.parse(JSON.stringify(res));

    ctx.body = res
})

// 搜索展示字段列表

router.get('/search' , async (ctx)=>{

    let params = ctx.query;

    let searchWord = params.searchWord.trim();

    let sql = `SELECT id,cmmdtyName FROM commdty WHERE cmmdtyName LIKE "%${searchWord}%"`;

    let res = await myDb.query(sql);

    if( res.length > 0 ) {

        ctx.body = res

    } else {

        ctx.body = false
    }
})




// 搜索完成列表
router.get('/searchList', async (ctx) => {

    let params = ctx.query;

    let searchWord = params.searchWord.trim()

    let sql = `SELECT id,cmmdtyName,imgUrl,price,selfSuppor,reviewCount,goodReview,shopName,info,promotionList FROM commdty WHERE cmmdtyName LIKE "%${searchWord}%"`;

    let res = await myDb.query(sql);


    for (let i = 0; i < res.length; i++) {

        let sql = `SELECT storage,RAM,size FROM deploy  WHERE commdtyId=${res[i].id}`;
        let _res = await myDb.query(sql);
        res[i]['deploy'] = _res[0];
        res[i].promotionList = res[i].promotionList.split(',');
        res[i].info = res[i].info.split(',')
    }

    res = JSON.parse(JSON.stringify(res));
    console.log(res)

    if (res.length > 0) {

        ctx.body = res

    } else {

        ctx.body = false
    }
})

// 商品详情页面

router.get('/productInfo', async (ctx) => {
    let params = ctx.query;
    let commdtyId = params.commdtyId;
    console.log(commdtyId)
    // commdty
    let commdty = `SELECT * FROM commdty WHERE id=${commdtyId}`
    let commdtyRes = await myDb.query(commdty);

    // deloy
    let deploy = `SELECT storage,RAM,size FROM deploy WHERE commdtyId=${commdtyId}`
    let deployRes = await myDb.query(deploy);

    // classes 
    let classes = `SELECT productId,commdtyTitle,color,storageType FROM classes WHERE commdtyId=${commdtyId}`
    let classesRes = await myDb.query(classes);

    // itemShopInfo  
    let itemShopInfo = `SELECT commdtyId,poromotionPointCu,poromotionPointNew,poromotionPointVo FROM itemshopinfo  WHERE commdtyId=${commdtyId}`
    let itemShopInfoRes = await myDb.query(itemShopInfo);

    // questionList
    let questionList = `SELECT id as questionId,commdtyId,productName,text FROM questionlist WHERE commdtyId=${commdtyId}`;
    let questionListRes = await myDb.query(questionList);
    questionListRes = JSON.parse(JSON.stringify(questionListRes));

    // reviewList
    let reviewList = `SELECT content,qualityStar,imgUrl,userName,reviewImageList FROM userinfo LEFT JOIN reviewlist ON (reviewlist.id=userinfo.reviewListId) WHERE userinfo.commdtyId=${commdtyId}`;

    let reviewListRes = await myDb.query(reviewList);
    reviewListRes = JSON.parse(JSON.stringify(reviewListRes));

    // subGoodSku 
    let subGoodSku = `SELECT * FROM subgoodsku WHERE commdtyId=${commdtyId}`;
    let subGoodSkuRes = await myDb.query(subGoodSku);

    // subGoodsSku 
    let subGoodsSku = `SELECT * FROM subgoodsku WHERE commdtyId=${commdtyId}`;
    let subGoodsSkuRes = await myDb.query(subGoodsSku);


    // 处理reviewList

    reviewListRes.forEach(item => {

        // 将imgurl username 放入userinfo对象
        item['userInfo'] = {
            imgUrl: item.imgUrl,
            uerName: item.userName
        }

        //将imglist字符串转化为数组
        item.reviewImageList = item.reviewImageList.split(',');

        // 将imglist数组元素转化为url 对象
        item.reviewImageList = item.reviewImageList.map(items => {
            return items = {
                url: items
            }
        })

    })

    // 处理商品详情表的轮播图片列表
    commdtyRes.forEach(item => {

        // 将字符串数据，转化为数组结构
        item.imgList = item.imgList.split(',');
        item.info = item.info.split(',');
        item.promotionList = item.promotionList.split(',');
        // 将外部数据作为数组或对象结构插入新数组
        item['deploy'] = deployRes[0];
        item['classes'] = classesRes;
        item['itemShopInfo'] = itemShopInfoRes[0];
        item['questionList'] = questionListRes;
        item['reviewList'] = reviewListRes;
        item['subGoodSku'] = subGoodSkuRes;
        item['subGoodsSku'] = subGoodsSkuRes;
    })

    ctx.body = commdtyRes
})


module.exports = router.routes()
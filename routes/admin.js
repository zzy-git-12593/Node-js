const router = require('koa-router')()
myDb = require('../lib/db')
sha1 = require('node-sha1')


// 路由中间件，判断session是否存在进行拦截；
router.use(async (ctx, next) => {
  
    // 获取当前路由地址

    let currentPath = ctx.url
    // 判断当前路由是否是登录或者登录验证路由

    if (currentPath.indexOf('login') > 0 || currentPath.indexOf('loginDo') > 0) {

        console.log('登录状态')
        await next();

    } else {
        // 判断session是否存在，存在表示已经登录放行 进入后台页面
        if (ctx.session.admin) {

            await next()

        } else {
            //session不存在进入登录界面
            ctx.redirect('/admin/login')
        }
    }
})

// get获取数据请求
router.get('/',async  (ctx) => {
    
    // 接收get传参
    let params = ctx.query;
    let go = params.go ? params.go:'welcome'
    let data;
    let typeTitleData;
    let pages=''; 
    let page= params.page ?params.page :1;
    // 跳转一级分类数据列表 //二级分类新增获取一级分类内容
    if (go =='typeNameList' || go == 'typeContentAdd') {
        
        // 删除一级分类数据 及二级分类相关所有数据
        if (params.id){

            let sql =`DELETE FROM typetitle WHERE id=${params.id}`;
            await myDb.query(sql);
            // 删除一级分类下所有相关二级商品数据
            let _sql =`DELETE FROM typecontent WHERE typeId=${params.id}`;
            await myDb.query(_sql);
                   
        } 
        
        let sql =`SELECT * FROM typetitle`;
        let res = await myDb.query(sql)
        data = JSON.parse(JSON.stringify(res))
        
    }

    //  修改一级分类列表数据获取，通过id传参
    if (go =='typeNameEdit') {
        
        if (params.id) {

            let sql = `SELECT id,typeName FROM typetitle WHERE id = ${params.id}`
            let res = await myDb.query(sql)
            data = JSON.parse(JSON.stringify(res))[0]

        }
    }

    // 二级分类商品数据获取
    if (go == 'typeContentList') {
       
        // 删除二级列表数据 id存在时
        if(params.id){
            
            let sql=`DELETE FROM typecontent WHERE id = ${params.id}`;
            await myDb.query(sql)
        }

        // 初始

        let pageRecords = 5;

        let start = (page-1)*pageRecords;

        let sql =`SELECT typetitle.id as typeId,typeName, typecontent.id,comName,imgUrl FROM typecontent LEFT JOIN typetitle ON (typecontent.typeId = typetitle.id) LIMIT ${start},${pageRecords}`;

        let res = await myDb.query(sql)
        data = JSON.parse(JSON.stringify(res))
    
        // 分页
    
        let _sql = 'SELECT count(*) as total FROM typecontent';
        let _res = await myDb.query(_sql);
        let totalRecords = _res[0].total;
    
        // 总页数
        let totalPages = Math.ceil(totalRecords/pageRecords);
    
        for(let i=1;i<= totalPages;i++) {
    
           if(i == page) {

                 pages+= `  <a href="${host}/admin?go=typeContentList&page=${i}" style="color:red" > ${i}</a>  `

           }else{
                 pages+= ` <a href="${host}/admin?go=typeContentList&page=${i}">${i}</a>  `
           }
        }
    
    }

    //  修改二级分类商品数据，以及所属一级分类类别
    if (go =='typeContentNameEdit') {

        if (params.id) {

            let sql =`SELECT typetitle.id as typeId,typeName, typecontent.id,comName,imgUrl FROM typecontent LEFT JOIN typetitle ON (typecontent.typeId = typetitle.id)  WHERE typecontent.id = ${params.id}`;

            let res = await myDb.query(sql)
            data = JSON.parse(JSON.stringify(res))[0]

        }
        let sql = `SELECT * FROM typetitle`;
        let res = await myDb.query(sql);
        typeTitleData = JSON.parse(JSON.stringify(res))
        typeTitleData = typeTitleData.filter(item=>{
                return  item.typeName != data.typeName       
        })

        typeTitleData.unshift({
            id:data.typeId,
            typeName:data.typeName
        })
                        
    }

   


    await ctx.render('admin',{ admin:ctx.session.admin, host,go,data,typeTitleData,pages})
})


// post请求
router.post('/typeName', async (ctx)=>{

    let data = ctx.request.body;
    console.log(data)
    // 记录添加的返回值
    let text='';
    // 一级分类数据新增
    if(data.go =='typeNameAdd'){

        if(data.title) {
            let sql = `INSERT INTO typetitle (typeName) VALUES ("${data.title}")`;

            let res =  await myDb.query(sql);

            if (res.affectedRows>0) {

                text ='添加成功';

            } else {

                text ='添加失败';
                
            }
        }
    }

    //  通过id 修改 一级分类列表的标题数据
    if (data.go =='typeNameEdit') {
     
        if (data.id) {

            let sql = `UPDATE typetitle SET typeName="${data.title}" WHERE id = ${data.id}`
            let res = await myDb.query(sql)
            if(res.affectedRows>0) {
                
                text='修改成功'

            }else {

                text='修改失败'
            }
        }
    }
    
    // 二级分类提交

    if(data.go =='typeContentAdd'){
        
        let currentTimer = new Date().getTime()
        let sql =  `INSERT INTO typeContent (typeId,comName,imgUrl,date) VALUES (${data.typeId},"${data.title}","${data.url}","${currentTimer}")`;
        let res = await myDb.query(sql); 

        if(res.affectedRows>0){

            text = '添加商品成功'
        
        } else {

            text = '添加商品失败'
        }
    }


    //  通过id 修改 二级分类商品名称的数据以及修改所有一级分类

    if (data.go =='typeContentNameEdit') {
        
        if (data.id) {
            // 通过商品id查询，修改所属一级分类id，商品标题，商品图片地址，
            let sql = `UPDATE typecontent SET typeId=${data.typeId}, comName="${data.title}", imgUrl="${data.imgUrl}"  WHERE id = ${data.id}`
            console.log(sql)
            let res = await myDb.query(sql)
            if(res.affectedRows>0) {
                
                text='修改成功'

            }else {

                text='修改失败'
            }
        }
        }

    await ctx.render('typeName',{ admin:ctx.session.admin, host,text})
})



// 登录界面
router.get('/login', async (ctx) => {
    
    await ctx.render('adminLogin')
})

// 前端ajxa 登录信息验证
router.post('/loginDo', async (ctx) => {

    // 获取ajxa提交的登录信息
    let data = ctx.request.body
    // 密码加密
    let pwdSha1 = sha1(data.pwd).substr(3, 20)
    // 通过登录信息筛选字段
    let sql = `SELECT count(*) as total FROM admin WHERE admin="${data.username}" AND pwd="${pwdSha1}"`;
    // 结果
    let res = await myDb.query(sql);

    // 结果为1 代表存在返回true
    if (res[0].total) {

        // 设置session
        ctx.session.admin = data.username

        ctx.body = true

    } else {
        // 否则false
        ctx.body = false
    }

})




// 退出页面
router.get('/exit', async (ctx)=>{
    ctx.session.admin='';
    ctx.redirect(host+'/admin')
})
module.exports = router.routes()
const Koa = require('koa')
router = require('koa-router')()
render = require('koa-art-template')
static = require('koa-static')
koaBody = require('koa-body')
fs = require('fs')
session = require('koa-session')
sha1 = require('node-sha1')
// 引入cors
cors = require('./lib/cors')

// 引入路径
path = require('path')

// 引入数据库

myDb = require('./lib/db')

// 引入路由

admin = require('./routes/admin') //后台用户名
type = require('./routes/type') // 分类页面
shoppingCar = require('./routes/add-shopcar') //购物车
productInfo = require('./routes/productInfo') // 商品详情
user = require('./routes/user-sign') //用户名注册与登录
token = require('./routes/token')//token 验证

// 全局路径
global.rootPath = __dirname;
global.host = 'http://localhost:2000'


// 初始化实例
const app = new Koa();

// 配置art-template
render(app, {
    root: path.join(__dirname, 'view'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

// 配置koa-body

app.use(koaBody({
    multipart: true, //支持多个文件
    formidable: {
        maxFileSize: 200 * 1024 * 1024 //设置上传大小最大2M
    }
}))

// 配置静态资源
app.use(static(path.join(__dirname, 'public')))

// 配置 cors 跨域,必须放在静态资源下面
app.use(cors)

// 配置session

// 设置key
app.keys = ['some secret hurr'];

// 配置session参数
const CONFIG = {
    key: 'koa:sess',
    /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true,
    /** (boolean) automatically commit headers (default true) */
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, //过期是否更新
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
// 使用
app.use(session(CONFIG, app));


// //////////////////////////////////////////////////////////////////


router.get('/home', async (ctx) => {

    // let pwd ='admin'
    
    // ctx.body = sha1(pwd).substr(3,20)
    ctx.body = '主页'
})

// 后台管理系统

router.use('/admin',admin)

// 分类标题获取

router.use('/type',type)

// 商品详情

router.use('/product',productInfo)

// 用户注册 登录

router.use('/user',user)

// token 验证

router.use('/token',token)

// 购物车商品

router.use('/shoppingcar',shoppingCar)

router.get('*', async (ctx) => {
    ctx.body = '404页面不存在'
})




// 配置路由 
app
    .use(router.routes())
    .use(router.allowedMethods());

// 监听端口
app.listen(2000, () => {
    console.log('Server-running at loalhost:2000')
})
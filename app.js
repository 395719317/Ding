/*
*入口文件
*/

//加载express模块
var express=require('express');

//模板处理模块
var swig=require('swig');

//加载数据库模块
var mongoose=require('mongoose');

//加载body-parser,用来处理post提交过来的数据
var bodyParser=require('body-parser');

//创建app应用 => nodeJs http.createServer();
var app=express();

var User=require('./models/User');  //导入自定义组件

//加载cookies模块
var Cookies=require('cookies');

//静态文件托管,public下的文件都会加载
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板-html文件
//第一参数：模板文案金的后缀
//第二参数解析处理模板内容的方法
app.engine('html',swig
    .renderFile);

//设置模板文件存放的目录
//第一个参数必须是views
//第二个参数是目录路径
app.set('views','./views');

//注册模板引擎
//一参数：必须是view engine
//第二参数是和app.engine定义的模板引擎的名称一致
app.set('view engine','html');

//开发过程先去掉缓存
//不去掉缓存，每次都要重启node才行
//上线要把缓存加上，能增加性能
swig.setDefaults({cache:false});

//bodyparser设置
app.use(bodyParser.urlencoded({extended:true}));

//设置cookie设置
app.use(function (req,res,next) {
    req.cookies=new Cookies(req,res);
    //解析用户的登入信息
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(
                function (userInfo) {
                    req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                    next();
                }

            )
        }catch (e){
            next();
        }
    }else {
        next();
    }


});

//首页
// app.get('/',function (req,res,next) {
//     //res.send('<h1>欢迎回来，丁鹏</h1>'); //一般html要用模板
//     res.render('index');
// });
//前台 后台 api都写在这不好，用下面的方式写


//按功能划分模块：前台 后台 api（ajax）
app.use('/admin',require('./routers/admin')); //所有路径是admin都会执行后面
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/blog',{ useNewUrlParser: true },function(err){
    if(err){
        console.log('false');
    }else{
        console.log('success');
        //监听http请求
        app.listen(8081);
    }

});

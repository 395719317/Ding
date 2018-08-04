//

var mongoose=require('mongoose');
//用户的表结构

module.exports=new mongoose.Schema({//声明模式类型

    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
})

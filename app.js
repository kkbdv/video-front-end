//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    
    // 登录方法
    // var that = this;//把当前域存到that中

    var dologin=function(){
      wx.login({       
        success:function(res){
          wx.request({
            url: 'http://127.0.0.1:8081/user/login'
            ,data: {
              code:res.code
          }
          ,success:function(res){
            wx.setStorageSync("token",res.data.data);
            console.log("我是reqst的res!!"+res)
           
          }
          ,fail:function(){//友好提示
            wx.showToast({
              title: '服务器错误'
              ,icon:'loading'
            
            })
          }
          })
        }
        
      })
    }
    //从存储中获取token
    let token =wx.getStorageSync("token");

    if(this.isToeknExist(token)){//1.是否首次登陆
      dologin();
    }else{//2.检查session是否过期
      wx.checkSession({
        success:function(){
          console.log("session未过期") //todo:log         
        }
        ,fail:function(){
          console.log("session过期，正在重新登陆")//todo:log
          dologin();//重新登陆
        }
      })
    }
  },
  
  isToeknExist:function(token){//判断token是否存在的方法
    let val =true;
    if (token == "" || token == null){
      val=false;
    }
    return val;
  }

  // globalData: {
  //   islogin:false
  // }
})
//app.js
App({
  serverUrl:"http://192.168.0.23:8081"
  , userInfo:null
  , reportReasonArray:[
    "暴力色情",
    "政治敏感",
    "引起不适"
  ]
  ,setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },
  
  onLaunch: function () {

    
  }
 
})
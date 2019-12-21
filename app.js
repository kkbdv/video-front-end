//app.js
App({
  // serverUrl:"http://192.168.43.88:8081"
  serverUrl: "http://127.0.0.1:8081"
  , userInfo:null
  , reportReasonArray:[
    "暴力色情",
    "政治敏感",
    "引起不适"
  ],
  TimeArray:[
    {
      value:30,
      label:"半小时"
    },
    {
      value:60,
      label:"一个小时"
    }
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
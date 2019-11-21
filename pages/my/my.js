// pages/my/my.js
//todo:获取用户关键值
const app =getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:false
  },
  getUserInfo:function(res){
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //todo:加loading提示
    var token =wx.getStorageSync("token")
    if (app.isToeknExist(token)){
      this.setData({
        islogin: true
      })
    }
    //todo:通过token去拿用户信息？是否要把用户信息存到app.js
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
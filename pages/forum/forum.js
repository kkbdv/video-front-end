// pages/form/form.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    screenHeight:0,
    status: ["red","green","grey"],
    statusDesc: ["未开始", "正在进行...","已结束"],
    forumList: [],
    serverUrl: app.serverUrl,
    page:1,
    total:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    var sysInfo= wx.getSystemInfoSync()


    me.setData({
      screenHeight:sysInfo.windowHeight
    })
    wx.showLoading({
      title: '加载中...',
    })
   
  //  me.getAllForum(1,0);
  
  },

  getAllForum:function(e,onshow){
    var me = this
    if(e==null||e==undefined||e==""){
      e=1
    }
    wx.request({
      url: app.serverUrl + "/forum/showAll?page=" + e,
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        //设值
        var list = me.data.forumList
        var newList = res.data.data.rows
        console.log(res)
        if(onshow==1){
          me.setData({
            forumList: newList,
            total: res.data.data.total,
            page: res.data.data.page
          })
        }else{
          me.setData({
            forumList: list.concat(newList),
            total: res.data.data.total,
            page: res.data.data.page
          })
        }   

      }
    })
  },

  toDetail:function(e){
    
    var forumId = e.currentTarget.dataset.arrindex
    wx.navigateTo({
      url: '../foruminfo/foruminfo?forumId='+forumId,
    })
  },
  onReachBottom :function(){
    var me = this
    var page = me.data.page
    var total = me.data.total
    if(page==total){
      wx.showToast({
        title: '已无更多',
        icon:"none",
        duration:2000
      })
      return;
    }
    page = page+1
    me.getAllForum(page,0)
  },
  onShow:function(){
    this.getAllForum(1,1)
  },
  onPullDownRefresh:function(){
    this.getAllForum(1,1)
    wx.stopPullDownRefresh();
  }

})
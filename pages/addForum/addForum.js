// pages/addForum/addForum.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    startTime:"",
    duration:"",
    realDuration:"",
    timeArry: app.TimeArray,
    serverUrl:app.serverUrl,
    addUrl:"../resource/images/add.png",
    realCoverUrl:"",
    initDate:"",
    initTime:""

  },
  bindDateChange:function(e){
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange:function(e){
    console.log(e)
    this.setData({
      startTime: e.detail.value
    })
  },
  bingTimeLong:function(e){
    var index = e.detail.value
    
    this.setData({
      duration: app.TimeArray[index].label,
      realDuration: app.TimeArray[index].value
    })
    console.log(this.data.realDuration)
    },
  addCover:function(){
    var me = this;
    var serverUrl = me.data.serverUrl
    var userInfo = app.getGlobalUserInfo();
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success: function(res) {
        var filepath = res.tempFilePaths[0]
        console.log(filepath)
        wx.uploadFile({
          url: serverUrl+'/forum/addCover?userId='+userInfo.id,
          filePath: filepath ,
          name: 'file',
          header: {
            'content-type': 'application/json', // 默认值
            'headerUserId': userInfo.id,
            'headerUserToken': userInfo.userToken
          },
          success:function(res){//todo: 把返回的路径添加到input的值里面。
            var reso= JSON.parse(res.data);
          
            console.log(reso)
            me.setData({
              addUrl: filepath,
              realCoverUrl: reso.message
            })

          
          }
        })


      }
    })
  },
  upload:function(e){
    var me = this
    var userInfo = app.getGlobalUserInfo();
    console.log(e)//e.detail.value.title
    var forumTitle = e.detail.value.title
    var forumAddress = e.detail.value.address
    var forumDesc = e.detail.value.desc
    var date = me.data.date
    var startTime = me.data.startTime
    var duration = me.data.realDuration
    var realCoverPath = me.data.realCoverUrl;

    if (forumTitle == "" || forumAddress == "" || forumDesc==""){
      wx.showToast({
        title: '请输入完整信息!',
        duration:2000,
        icon:"none"
      })
      return;
    }else if(me.data.realCoverUrl==""){
      wx.showToast({
        title: '请上传图片!',
        icon:"none"
      })
    }else if(date==""||startTime==""||duration==""){
      wx.showToast({
        title: '请选择时间!',
        icon: "none"
      })
    }
    wx.request({
      url: me.data.serverUrl+'/forum/add?userId='+userInfo.id,
      method:"POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': userInfo.id,
        'headerUserToken': userInfo.userToken
      },
      data:{
        forumTitle: forumTitle,
        forumAddress: forumAddress,
        forumDesc: forumDesc,
        forumDate:date,
        forumStart: startTime,
        forumDuration: duration,
        forumCoverpath: realCoverPath
      },
      success:function(res){
        console.log(res)
        if(res.data.code==0){
          wx.showToast({
            title: '上传成功!',
            duration:1500,
            icon:"success"
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../forum/forum',
            })
          },1500)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this
    var rowDate = new Date();
    console.log(rowDate)
    var Y = rowDate.getFullYear().toString()
    var M = (rowDate.getMonth()+1).toString()
    var D = rowDate.getDate().toString()
    var H = rowDate.getHours().toString()
    var m = rowDate.getMinutes().toString()
    var fin = Y+'-'+M+'-'+D
    var fint = H+":"+m
    console.log(fint)
    me.setData({
      initDate:fin,
      initTime:fint
    })    
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
// pages/foruminfo/foruminfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMine:false,
    isJoin:false,
    forum:null,
    serverUrl:app.serverUrl,
    isdisable:false,
    joinCounts:1
  },
  doJoin:function(){
    var me = this
    var flag = this.data.isJoin
    var serverUrl = this.data.serverUrl
    var forum = this.data.forum
    var userInfo = app.getGlobalUserInfo();
      if(userInfo==""||userInfo==null||userInfo==undefined){//登陆校验
        wx.navigateTo({
          url: '../userLogin/login',
        })
        return;
      }
      if(flag==false){
        wx.request({
          url: serverUrl + '/forum/join?forumId=' + forum.id +'&userId='+userInfo.id,
          method: "POST",
          success: function (res) {
            me.setData({
              isJoin: !flag
            })
          }
        })
      }else{
        wx.request({
          url: serverUrl + '/forum/unjoin?forumId=' + forum.id + '&userId=' + userInfo.id,
          method: "POST",
          success: function (res) {
            console.log(res.data.message);
            me.setData({
              isJoin: !flag
            })
          }
        })
      }
      //刷新
    me.refreshJoinCounts();
  },
  back:function(){
    wx.switchTab({
      url: '../forum/forum',
    })
  },
  toPublisher:function(){
    var publisherId = this.data.forum.userId
    wx.navigateTo({
      url: '../mineNavigate/mine?publisherId=' + publisherId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var me = this
    if (e.isMine==1){//是否自己的讲座
      me.setData({
        isMine:true
      })
    }   

    var serverUrl = app.serverUrl
    var userInfo = app.getGlobalUserInfo()
    wx.showLoading({
      title: '加载中...',
    })
    //获取讲座信息
    wx.request({
      url: serverUrl+'/forum/detail?forumId='+e.forumId,
      method:"POST",
      success:function(res){
        wx.hideLoading()
        var obj = res.data.data
        var counts = obj.joinCounts
        if(obj.faceImage==null){
          obj.faceImage ="/noneface.png"
        }
        console.log(res)
        me.setData({
          forum:obj,
          joinCounts: counts

        })
        //获取是否有参与:1.参与了，
        wx.request({
          url: serverUrl + '/forum/isJoin?forumId=' + obj.id + '&userId=' + userInfo.id,
          method:"POST",
          success:function(res){
              if(res.data.data){//true: has joined
                  me.setData({
                    isJoin:true
                  })
              }else{
                me.setData({
                  isJoin: false
                })
              }
          }
        })
        //按状态处理cancel按钮
        if(obj.status==1||obj.status==2){
          me.setData({
            isdisable:true
            
          })
        }else{
          me.setData({
            isdisable: false
          })
        }
      
      }
    })
    

  },
  refreshJoinCounts:function(){
    var me = this
    var serverUrl = app.serverUrl;
    var forum = me.data.forum
    wx.request({
      url: serverUrl+'/forum/getJoinCount?forumId='+forum.id,
      method:"POST",
      success:function(res){
        if(res.data.code==0){
          if(me.data.isJoin==false){//实现的不好
            me.setData({
              joinCounts: res.data.data + 1
            })
          }else{
            me.setData({
              joinCounts: res.data.data - 1
            })
          }
          
        }else{
          return;
        }
       
      }
    })
  }


})
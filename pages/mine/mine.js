var videoUtil = require('../../utils/videoUtil.js')

const app = getApp()

Page({
  data: {
    faceUrl: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,


    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",
    isSelectedForum:"",

    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,

    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    followVideoList: [],
    followVideoPage: 1,
    followVideoTotal: 1,

    forumList:[],
    forumPage:1,
    forumTotal:1,

    myWorkFalg: false,
    myLikesFalg: true,
    myFollowFalg: true,
    myForumFlag:true

  },

  onLoad: function (params) {
    var me = this;

    // var user = app.userInfo;
    // fixme 修改原有的全局对象为本地缓存
    var user = app.getGlobalUserInfo();
    var userId = user.id;

    var publisherId = params.publisherId;
    if (publisherId != null && publisherId != '' && publisherId != undefined) {
      userId = publisherId;
      me.setData({
        isMe: false,
        publisherId: publisherId,
        serverUrl: app.serverUrl
      })
    }
    me.setData({
      userId: userId
    })


    wx.showLoading({
      title: '请等待...',
    });
    var serverUrl = app.serverUrl;
    // 调用后端
    wx.request({
      url: serverUrl + '/user/query?userId=' + userId + "&fanId=" + user.id,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': user.id,
        'headerUserToken': user.userToken
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 0) {
          var userInfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
            faceUrl = serverUrl + userInfo.faceImage;
          }


          me.setData({
            faceUrl: faceUrl,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts,
            nickname: userInfo.nickname,
            isFollow: userInfo.follow
          });
        } else if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            duration: 3000,
            icon: "none",
            success: function () {
              wx.redirectTo({
                url: '../userLogin/login',
              })
            }
          })
        }
      }
    })

    me.getMyVideoList(1);
  },

  followMe: function (e) {
    var me = this;

    var user = app.getGlobalUserInfo();
    var userId = user.id;
    var publisherId = me.data.publisherId;

    var followType = e.currentTarget.dataset.followtype;

    // 1：关注 0：取消关注
    var url = '';
    if (followType == '1') {
      url = '/user/beyourfans?userId=' + publisherId + '&fanId=' + userId;
    } else {
      url = '/user/dontbeyourfans?userId=' + publisherId + '&fanId=' + userId;
    }

    wx.showLoading();
    wx.request({
      url: app.serverUrl + url,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': user.id,
        'headerUserToken': user.userToken
      },
      success: function () {
        wx.hideLoading();
        if (followType == '1') {
          me.setData({
            isFollow: true,
            fansCounts: ++me.data.fansCounts
          })
        } else {
          me.setData({
            isFollow: false,
            fansCounts: --me.data.fansCounts
          })
        }
      }
    })
  },



  logout: function () {
    // var user = app.userInfo;
    var user = app.getGlobalUserInfo();

    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待...',
    });
    // 调用后端
    wx.request({
      url: serverUrl + '/user/logout?userId=' + user.id,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 0) {
          // 登录成功跳转 
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 2000
          });
          // app.userInfo = null;
          // 注销以后，清空缓存
          wx.removeStorageSync("userInfo")
          // 页面跳转
          wx.redirectTo({
            url: '../userLogin/login',
          })
        }
      }
    })
  },

  changeFace: function () {
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed','original'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);

        wx.showLoading({
          title: '上传中...',
        })
        var serverUrl = app.serverUrl;
        // fixme 修改原有的全局对象为本地缓存
        var userInfo = app.getGlobalUserInfo();

        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + userInfo.id,  //app.userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json', // 默认值
            'headerUserId': userInfo.id,
            'headerUserToken': userInfo.userToken
          },
          success: function (res) {
            console.log(res)
            var data = JSON.parse(res.data);//把Json字符串对象转成Json对象
            console.log(data);
            wx.hideLoading();
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功!~~',
                icon: "success"
              });

              var imageUrl = data.data;
              me.setData({
                faceUrl: serverUrl + imageUrl
              });

            } else if (data.code == 200) {
              wx.showToast({
                title: data.message
              });
            } else if (res.data.status == 502) {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: "none",
                success: function () {
                  wx.redirectTo({
                    url: '../userLogin/login',
                  })
                }
              });

            }

          }
        })


      }
    })
  },

  uploadVideo: function () {
    // fixme 视频上传复用
    // videoUtil.uploadVideo();
    // 以下是原来的代码，不删除，便于参照
    var me = this;

    wx.chooseVideo({
      sourceType: ['album'],
      success: function (res) {
        console.log(res);

        var duration = res.duration;
        var tmpHeight = res.height;
        var tmpWidth = res.width;
        var tmpVideoUrl = res.tempFilePath;
        var tmpCoverUrl = res.thumbTempFilePath;

        if (duration > 11) {
          wx.showToast({
            title: '视频长度不能超过10秒...',
            icon: "none",
            duration: 2500
          })
        } else if (duration < 1) {
          wx.showToast({
            title: '视频长度太短，请上传超过1秒的视频...',
            icon: "none",
            duration: 2500
          })
        } else {
          // 打开选择bgm的页面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration
            + "&tmpHeight=" + tmpHeight
            + "&tmpWidth=" + tmpWidth
            + "&tmpVideoUrl=" + tmpVideoUrl
            + "&tmpCoverUrl=" + tmpCoverUrl
            ,
          })
        }

      }
    })

  },


  doSelectWork: function () {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",
      isSelectedForum: "",

      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true,
      myForumFlag: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,

      forumList: [],
      forumPage: 1,
      forumTotal: 1
    });

    this.getMyVideoList(1);
  },

  doSelectLike: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",
      isSelectedForum: "",

      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true,
      myForumFlag: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,
      
      forumList: [],
      forumPage: 1,
      forumTotal: 1
    });

    this.getMyLikesList(1);
  },

  doSelectFollow: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "",
      isSelectedFollow: "video-info-selected",
      isSelectedForum:"",

      myWorkFalg: true,
      myLikesFalg: true,
      myFollowFalg: false,
      myForumFlag:true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,
      
      forumList: [],
      forumPage: 1,
      forumTotal: 1
    });

    this.getMyFollowList(1)
  },

  //讲座选择事件
  doSelectForum:function(){
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "",
      isSelectedFollow: "",
      isSelectedForum:"video-info-selected",

      myWorkFalg: true,
      myLikesFalg: true,
      myFollowFalg: true,
      myForumFlag:false,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,

      forumList: [],
      forumPage:1,
      forumTotal:1,

      status: ["red", "green", "grey"],
      statusDesc: ["未开始", "正在进行...", "已结束"]
    })
    this.getMyFormList(1);
  },

  getMyFormList:function(page){
    var me = this;
    wx.showLoading({
      title: '加载中...',
    })
    var serverUrl = app.serverUrl;
    var userInfo = app.getGlobalUserInfo();
    wx.request({
      url: serverUrl +'/forum/getMyForum?userId='+userInfo.id+"&page="+page,
      method:"POST",
      header:{
        'headerUserId': userInfo.id,
        'headerUserToken': userInfo.userToken
      },
      success:function(res){
        wx.hideLoading();
        var newList = res.data.data.rows;
        var list = me.data.forumList;
        me.setData({
          forumList:list.concat(newList),
          forumPage:res.data.data.page,
          forumTotal:res.data.data.total
        })
      }
    })
  },

  getMyVideoList: function (page) {
    var me = this;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showAll?page=' + page + '&pageSize=6',
      method: "POST",
      data: {
        userId: me.data.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var myVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.myVideoList;
        me.setData({
          myVideoPage: page,
          myVideoList: newVideoList.concat(myVideoList),
          myVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },
  //跳转到发布讲座
  toAddForum:function(){
    wx.navigateTo({
      url: '../addForum/addForum',
    })
  },


  getMyLikesList: function (page) {
    var me = this;
    var userId = me.data.userId;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyLike/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var likeVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.likeVideoList;
        me.setData({
          likeVideoPage: page,
          likeVideoList: newVideoList.concat(likeVideoList),
          likeVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },

  getMyFollowList: function (page) {
    var me = this;
    var userId = me.data.userId;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyFollow/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var followVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.followVideoList;
        me.setData({
          followVideoPage: page,
          followVideoList: newVideoList.concat(followVideoList),
          followVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },

  // 点击跳转到视频详情页面
  showVideo: function (e) {

    console.log(e);

    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;
    
    if (!myWorkFalg) {
      var videoList = this.data.myVideoList;
    } else if (!myLikesFalg) {
      var videoList = this.data.likeVideoList;
    } else if (!myFollowFalg) {
      var videoList = this.data.followVideoList;
    }

    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);

    wx.redirectTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
    })

  },

  // 到底部后触发加载
  onReachBottom: function () {
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;
    var myForumFlag = this.data.myForumFlag;

    if (!myWorkFalg) {
      var currentPage = this.data.myVideoPage;
      var totalPage = this.data.myVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyVideoList(page);
    } else if (!myLikesFalg) {
      var currentPage = this.data.likeVideoPage;
      var totalPage = this.data.myLikesTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyLikesList(page);
    } else if (!myFollowFalg) {
      var currentPage = this.data.followVideoPage;
      var totalPage = this.data.followVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyFollowList(page);
    }else if(!myForumFlag){
      var currentPage = this.data.forumPage;
      var totalPage = this.data.forumTotal;
      if(currentPage==totalPage){
        wx.showToast({
          title: '已经没有了',
          icon:"none"
        })
        return;
      }
      var page = currentPage+1
      this.getMyFormList(page)
    }

  },
  longPressDelete:function(e){
    var me = this;
    var videoIndex = e.currentTarget.dataset.arrindex;
    var video =  me.data.myVideoList[videoIndex];
    var serverUrl = app.serverUrl;
    if (me.data.isMe==false){
      return;
    }

    wx.showModal({
      title: '提示',
      content: '确定删除视频吗?',
      success:function(res){
        if(res.confirm==true){
          wx.showLoading({
            title: '正在删除...',
          });
          wx.request({
            url: serverUrl + '/video/delete?videoId=' + video.id,
            method:'POST',
            data:{
              videoPath: video.videoPath,
              coverPath: video.coverPath
            },
            success:function(res){
             wx.hideLoading();
             wx.showToast({
               title: '删除成功',
               duration:2000,
               icon:'none'
             }) ,
             me.setData({
               myVideoList:[]
             })
              me.getMyVideoList(1);
            }
          })
        }
      }
    })
  },
  deleteForum:function(e){
    var me = this
    var serverUrl = me.data.serverUrl
    var index = e.currentTarget.dataset.delindex;
    var forum = me.data.forumList[index];

    wx.showModal({
      title: '提示',
      content: '确定删除活动吗?',
      success: function (res) {
        if (res.confirm == true) {
          wx.showLoading({
            title: '正在删除...',
          });
          wx.request({
            url: serverUrl + '/forum/delete?forumId=' + forum.id,
            method: 'POST',
            data: {
              forumCoverpath: forum.forumCoverpath
            },
            success: function (res) {
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
                duration: 2000,
                icon: 'none'
              }),
                me.setData({
                forumList: []
                })
              me.getMyFormList(1);
            }
          })
        }
      }
    })
  },
  toDetail:function(e){
    var forumId = e.currentTarget.dataset.arrindex
    wx.navigateTo({
      url: '../foruminfo/foruminfo?forumId=' + forumId+"&isMine="+1,
    })
  }
 
})

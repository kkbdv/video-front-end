const app = getApp()

Page({
    data: {

    },

    doRegist: function(e) {
      var me = this;
      var formObject = e.detail.value;
      var username = formObject.username;
      var password = formObject.password;

      // 简单验证
      if (username.length == 0 || password.length == 0) {
        wx.showToast({
          title: '用户名或密码不能为空',
          icon: 'none',
          duration: 3000
        })
      } else {
        var serverUrl = app.serverUrl;
        wx.showLoading({
          title: '请等待...',
        });
        wx.request({
          url: serverUrl + '/user/regist',
          method: "POST",
          data: {
            username: username,
            password: password
          },
          header: {
            'content-type': 'application/json' // 默认值-数据在body中
          },
          success: function(res) {
            console.log(res.data);
            wx.hideLoading();
            var status = res.data.code;
            if (status == 0) {
              wx.showToast({
                title: "用户注册成功~！！！",
                icon: 'none',
                duration: 3000
              }),
              // app.userInfo = res.data.data;
              console.log(app.userInfo )
              // fixme 修改原有的全局对象为本地缓存
              app.setGlobalUserInfo(res.data.data);
              // 页面跳转
                wx.switchTab({
                  url: '../mine/mine',
                })
            } else if (status == 200) {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
      }
    },

    goLoginPage:function() {
      wx.navigateTo({
        url: '../userLogin/login',
      })
    }
})
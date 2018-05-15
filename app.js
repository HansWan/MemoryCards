//app.js
App({

  onLoad: function (options) {
    console.log('appload')
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  //获得屏幕高度和宽度
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
      }
    })
  //初始化一个播放声音的组件
    this.globalData.innerAudioContext = wx.createInnerAudioContext();
    this.globalData.innerAudioContext.autoplay = false;
  },

  playAudio: function(audiosrc){
    this.globalData.innerAudioContext.src = this.globalData.audiosrc[audiosrc];     
    this.globalData.innerAudioContext.play();
  },

  globalData: {
    userInfo: null,
    innerAudioContext: null,
    audiosrc: {
//      'audiowelcome': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201708/9077.mp3',
      'audiowelcome': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201301/2591.mp3',
      'audiodealbigcards': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201507/6098.mp3',   
      'audiodealsmallcards': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201403/4256.mp3',
      'audiodropcards': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201502/5473.mp3',
      'audiocomplete': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201712/9586.mp3',
      'audiofailed': 'http://dx.sc.chinaz.com/Files/DownLoad/sound1/201302/2687.mp3',
    },

  }
})
// pages/home/home.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: 'Try to memory everything! Good luck!',
    level: 1,
    complete: false,
    allsmallcardsonbigcards: false,
    initwaitingtime: 2000,
    intervalwaitingtime: 300,
    cardquantity: 6,
    cardnumber: 0,
    cardsperrow: 3,
    cardspercolumn: 3,
    bigcardwidth: 0,
    bigcardheight: 0,
    bigcards: [],
    bigcardsidlist: [],
    smallcardwidth: 0,
    smallcardheight: 75,
    //    smallcardtop: 0,
    smallcards: [],
    smallcardsidlist: [],
    smallcardsinitposition: [],
    touchStart: [0, 0],      //记录按上去的点的初始位置
    touchEnd: [0, 0],
    smallcardsn: 0,
    matches: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.initCards(res);
      }
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

  },

  initCards: function (res) {
    var that = this;
    console.log(res.pixelRatio);
    console.log(res.windowWidth);
    console.log(res.windowHeight);
//    var smallcardtop = res.windowHeight - 95 - res.windowWidth / that.data.cardquantity / 2 * 3;     //屏幕高减按钮高度，再减小牌高度
    var smallcardtop = res.windowWidth / that.data.cardsperrow / 2 * 3*2;     //2倍大牌高度+50
    //初始化大、小牌
    for (var i = 0; i < that.data.cardquantity; i++) {
      //          { name: 'image0', url: '../../images/1.png', width: 0, height: 0, left: 0, top: 0, x: 0, y: 0 },
      that.data.bigcards.push({ name: 'image' + i, url: '../../images/00.png', width: 0, height: 0, left: 0, top: 0, x: 0, y: 0 });
      that.data.smallcards.push({ name: 'image' + i, url: '../../images/' + (i + 1) + '.png', width: 0, height: 0, left: 0, top: smallcardtop, x: 0, y: 0 });
    };
    that.setData({
      windowWidth: res.windowWidth,
      windowHeight: res.windowHeight,
      bigcardwidth: res.windowWidth / that.data.cardsperrow,
      bigcardheight: res.windowWidth / that.data.cardsperrow / 2 * 3,
      smallcardwidth: res.windowWidth / that.data.cardquantity,
      smallcardheight: res.windowWidth / that.data.cardquantity / 2 * 3,

      bigcards: that.data.bigcards,
      bigcards: that.data.smallcards,
    });
  },

  getRandomArrayElements: function (arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },

  dealCards: function () {
    var that = this;
    var fullcards = [];
    for (var i = 1; i < 55; i++) {
      fullcards.push(String(i));
    }

    that.setData({
      bigcardsidlist: that.getRandomArrayElements(fullcards, that.data.cardquantity)
    });

//    var smallcardtop = that.data.windowHeight - 95 - that.data.windowWidth / that.data.cardquantity / 2 * 3;     //屏幕高减按钮高度，再减小牌高度
    var smallcardtop = that.data.windowWidth / that.data.cardsperrow / 2 * 3 * 2;     //2倍大牌高度+50
    that.setData({
      complete: false,
      allsmallcardsonbigcards: false,
      cardnumber: 0,
      matches: [],
      smallcardsinitposition: []
    });

    that.setData({
      bigcardwidth: that.getCardWidth(),
      bigcardheight: that.getCardHeight()
    });

    for (var i = 0; i < that.data.cardquantity; i++) {
      that.data.bigcards[i].url = '../../images/' + '0' + '.png';
      that.data.smallcards[i].url = '../../images/' + '0' + '.png';
      that.data.matches.push([that.data.bigcardsidlist[i], '']);
      that.data.smallcards[i].top = smallcardtop;
    }
    that.setData({
      bigcards: that.data.bigcards,
      smallcards: that.data.smallcards,
      matches: that.data.matches
    });
    console.log('origin matches: ' + that.data.matches);

    var interval = setInterval(function () {
      if (that.data.cardnumber == that.data.cardquantity) {
        //大牌打乱顺序赋给小牌变量
        that.data.smallcardsidlist = that.getRandomArrayElements(that.data.bigcardsidlist, that.data.cardquantity);
        that.setData({
          smallcardsidlist: that.data.smallcardsidlist
        });
        console.log(that.data.smallcardsidlist);
        //所有大牌翻成反面
        for (var i = 0; i < that.data.cardquantity; i++) {
          that.data.bigcards[i].url = '../../images/' + '0' + '.png';
          that.data.smallcards[i].url = '../../images/' + that.data.smallcardsidlist[i] + '.png';
          //          that.data.bigcards[i].x = (i % that.data.cardquantity + 0.5) * that.data.smallcardwidth;
          that.data.smallcards[i].width = that.data.smallcardwidth;
          that.data.smallcards[i].height = that.data.smallcardheight;
          that.data.smallcards[i].left = i * that.data.smallcardwidth;
          that.data.smallcards[i].top = smallcardtop;
          that.data.smallcardsinitposition.push([i * that.data.smallcardwidth, smallcardtop])
          that.setData({
            bigcards: that.data.bigcards,
            smallcards: that.data.smallcards,
            smallcardsinitposition: that.data.smallcardsinitposition
          });
        }
        clearInterval(interval);
      }
      else {
        //每隔一段时间亮1张牌
        that.data.bigcards[that.data.cardnumber].url = '../../images/' + that.data.bigcardsidlist[that.data.cardnumber] + '.png';
        that.data.bigcards[that.data.cardnumber].width = that.data.bigcardwidth;
        that.data.bigcards[that.data.cardnumber].height = that.data.bigcardheight;
        //计算每张牌的中心位置
        that.data.bigcards[that.data.cardnumber].x = (that.data.cardnumber % that.data.cardsperrow + 0.5) * that.data.bigcardwidth;
        that.data.bigcards[that.data.cardnumber].y = (parseInt(that.data.cardnumber / that.data.cardsperrow) + 0.5) * that.data.bigcardheight;
        //        that.data.smallcards[that.data.cardnumber].url = that.data.bigcards[that.data.cardnumber].url;
        console.log(that.data.bigcards[that.data.cardnumber].x);
        console.log(that.data.bigcards[that.data.cardnumber].y);
        that.setData({
          bigcards: that.data.bigcards,
          cardnumber: that.data.cardnumber + 1
        });
      }
    }, that.data.intervalwaitingtime);
  },

  showCards: function () {
    var that = this;
    //所有大牌翻成正面
    for (var i = 0; i < that.data.cardquantity; i++) {
      that.data.bigcards[i].url = '../../images/' + that.data.bigcardsidlist[i] + '.png';
      that.setData({
        bigcards: that.data.bigcards
      });
    }
    if (this.checkMatches()) {
      this.setData({
        complete: true
      })
      console.log('matched!')
    }
    else {
      console.log('not matched!')
    };
  },

  getCardWidth: function () {
    const { screenWidth, screenHeight, devicePixelRatio } = wx.getSystemInfoSync();
    return screenWidth / this.data.cardsperrow;
  },

  getCardHeight: function () {
    const { screenWidth, screenHeight, devicePixelRatio } = wx.getSystemInfoSync();
    return screenWidth / this.data.cardsperrow / 2 * 3 - 27;
  },

  smallcardClick: function (e) {
    //    console.log('click');
  },

  smallcardMoveStart: function (e) {
    var sn = e.target.id.slice(5);
    console.log('startmove ' + sn);
    this.setData({
      touchStart: [e.touches[0].pageX, e.touches[0].pageY],
      smallcardsn: sn
    });
  },

  smallcardMoveEnd: function (e) {
    //先把小牌原来记录的matches要清空，要不然会记录重复
    this.clearMatch(this.data.smallcardsn);
    this.checkOverlap(this.data.smallcardsn, this.data.touchEnd)
  },

  smallcardMove: function (e) {
    console.log('move');
    var endpointX = e.touches[0].pageX < 0 ?
      this.data.smallcardwidth / 2
      : (e.touches[0].pageX > this.data.windowWidth ?
        this.data.windowWidth - this.data.smallcardwidth / 2
        : e.touches[0].pageX);
    var endpointY = e.touches[0].pageY < 0 ?
      this.data.smallcardheight / 2
      : (e.touches[0].pageY > this.data.windowHeight ?
        this.data.windowHeight - this.data.smallcardheight / 2
        : e.touches[0].pageY);
    this.setData({
      touchEnd: [endpointX, endpointY]
    });
  },

  clearMatch: function (sn) {
    for (var i = 0; i < this.data.cardquantity; i++) {
      if (this.data.matches[i][1] == sn) {
        this.data.matches[i][1] = ''
        this.setData({
          matches: this.data.matches
        });
        break;
      }
    }
  },

  checkOverlap: function (sn, endpoint) {
    var deviation = 80;
    for (var i = 0; i < this.data.cardquantity; i++) {
      if (
        (
          (this.data.bigcards[i].x > endpoint[0] && this.data.bigcards[i].x - endpoint[0] < deviation)
          ||
          (this.data.bigcards[i].x < endpoint[0] && this.data.bigcards[i].x - endpoint[0] > -deviation)
        )
        &&
        (
          (this.data.bigcards[i].y > endpoint[1] && this.data.bigcards[i].y - endpoint[1] < deviation)
          ||
          (this.data.bigcards[i].y < endpoint[1] && this.data.bigcards[i].y - endpoint[1] > -deviation)
        )
      ) {
        this.setSmallcardMiddleofBigcard(sn, i);
        console.log(sn + ' ' + i + ' ' + 'overlap');
        if (this.data.matches[i][1] != '') {    //if大牌上已经有一张小牌，就把原来的小牌先移回原位，再摆上后来拖过来的小牌
          this.data.smallcards[this.data.matches[i][1]].left = this.data.smallcardsinitposition[this.data.matches[i][1]][0];
          this.data.smallcards[this.data.matches[i][1]].top = this.data.smallcardsinitposition[this.data.matches[i][1]][1];
          this.setData({
            smallcards: this.data.smallcards
          })
        }
        this.data.matches[i][1] = sn;
        this.setData({
          matches: this.data.matches
        });
        this.checksmallcardsset();
//        if (this.checkMatches()) {
//          this.setData({
//            complete: true
//          })
//          console.log('matched!')
//        }
//        else {
//          console.log('not matched!')
//        };
        break;
      }
      else {      //小牌没有停靠一张大牌，就回原位
        this.setData({
          smallcards: this.data.smallcards
        })
      }
    }
  },

  setSmallcardMiddleofBigcard: function (sn, i) {
    this.data.smallcards[sn].left = this.data.bigcards[i].x - this.data.smallcardwidth / 2;
    this.data.smallcards[sn].top = this.data.bigcards[i].y - this.data.smallcardheight / 2;
    this.setData({
      smallcards: this.data.smallcards
    })
  },

  checksmallcardsset: function() {
    for (var i = 0; i < this.data.cardquantity; i++) {
      if (this.data.matches[i][1] == '') {
        //小牌没有摆完，不能亮牌，也不能过关
        return
      }
    };
    this.setData({
      allsmallcardsonbigcards: true
    })
  },

  checkMatches: function () {
    //如果小牌都摆到大牌上面了，才可以点亮牌
    for (var i = 0; i < this.data.cardquantity; i++) {
      if (this.data.matches[i][0] != this.data.smallcardsidlist[this.data.matches[i][1]]) {
        return false
      };
    };
    return true;
  },

  testClick: function () {
    this.setData({
      movebuttonX: 10,
      movebuttonY: 20
    })
  }
})
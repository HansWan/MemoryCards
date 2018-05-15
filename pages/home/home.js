// pages/home/home.js
//获取应用实例
const app = getApp()
var desktopmarginleft = 6;
var desktopmarginright = 6;
var desktopmargintop = 6;
var bigcardsinterval = 5;
var smallcardsinterval = 3;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: 'Try to memory everything! Good luck!',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setGlobalParameters();
  },

  onUnload: function() {
    this.saveGame();
  },

  setGlobalParameters: function() {
    var that = this;
    if (typeof (that.data.movableareatop) == "undefined") {
      that.getMovableareaTop();      //获得移动区域的top值，以便获得touches的相对XY坐标
    }
    console.log('movableareatop in setgamep: ' + that.data.movableareatop)
//设置屏幕高、宽
    that.setData({
      desktopWidth: app.globalData.windowWidth,   //减掉左右两边的边距
      desktopHeight: app.globalData.windowHeight,   //减掉上边的边距
      level: 1,
      cardsperrow: 3,                   //每行最多放三张大牌
      cardspercolumn: 3,
      score: 0,
    });
    bigcardsinterval = that.data.desktopWidth / ((that.data.cardsperrow + 1) + that.data.cardsperrow * 4);   ////按每张大牌间隔1/4张大牌，左右边距也按1/4张大牌来设置
    desktopmarginleft = bigcardsinterval;
    desktopmarginright = bigcardsinterval;
  },
  
  resetCards: function () {
    var that = this;
    var bigcards = [];
    var smallcards = [];
    that.setGameDifficulty(that);          //根据level设置发牌数量、速度，以及从多少张牌库里面发牌
    //初始化大、小牌
    for (var i = 0; i < that.data.cardsquantity; i++) {
      bigcards.push({ 
        name: 'image' + i, 
        url: '../../images/0.png', 
        width: 0, 
        height: 0, 
        x: 0, 
        y: 0 
      });
      smallcards.push({ 
        name: 'image' + i, 
        url: '../../images/0.png', 
        width: 0, 
        height: 0, 
        x: 0, 
        y: 0 
      });
    };
    that.setData({
      bigcardwidth: bigcardsinterval * 4,
      bigcardheight: bigcardsinterval * 4 / 5.7 * 8.8,     //网上查标准的牌是5.7*8.8cm
      smallcardwidth: (that.data.desktopWidth - smallcardsinterval*5) / 6,   //小牌的大小必须固定
      smallcardheight: that.data.desktopWidth / 6 / 5.7* 8.8,
      bigcards: bigcards,
      smallcards: smallcards,
    });
  },

  setGameDifficulty: function (that) {      //时间、发牌数、牌库起止序号
    var cardsset = [
      [1,2], 
      [1, 15], 
      [[1, 15], [29, 41]],    //只从黑牌中挑，以增加难度
      [1, 41], 
      [1, 54]
      ]
    var difficulty = [
//难度-1，从单一花色中发牌
      [1, 1, cardsset[0]], 
      [1, 2, cardsset[1]],
      [1, 3, cardsset[1]], 
      [0.5, 4, cardsset[1]], 
      [0.5, 5, cardsset[1]],
      [0.5, 6, cardsset[1]],
      [0.3, 4, cardsset[1]],
      [0.3, 5, cardsset[1]],
      [0.3, 5, cardsset[1]],
      [0.3, 6, cardsset[1]],
//难度-2，从2套花色中发3张牌
      [0.5, 3, cardsset[3]],
      [0.5, 3, cardsset[3]],
      [0.5, 3, cardsset[3]],
      [0.3, 3, cardsset[3]],
      [0.3, 3, cardsset[3]],
      [0.4, 3, cardsset[2]],
      [0.4, 3, cardsset[2]],
      [0.3, 3, cardsset[2]],
      [0.3, 3, cardsset[2]],
      [0.3, 3, cardsset[2]],
//难度-3，从4套花色中发6张牌
      [0.5, 6, cardsset[4]],
      [0.5, 6, cardsset[4]],
      [0.5, 6, cardsset[4]],
      [0.3, 6, cardsset[4]],
      [0.3, 6, cardsset[4]],
      [0.3, 6, cardsset[4]],
      [0.3, 6, cardsset[4]],
      [0.2, 6, cardsset[4]],
      [0.2, 6, cardsset[4]],
      [0.2, 6, cardsset[4]],
//难度-4，从3套花色中发6张牌
      [0.5, 6, cardsset[3]],
      [0.5, 6, cardsset[3]],
      [0.5, 6, cardsset[3]],
      [0.3, 6, cardsset[3]],
      [0.3, 6, cardsset[3]],
      [0.3, 6, cardsset[3]],
      [0.2, 6, cardsset[3]],
      [0.2, 6, cardsset[3]],
      [0.1, 6, cardsset[3]],
      [0.1, 6, cardsset[3]],
//难度-5，从两套花色中发六张牌
      [0.2, 6, cardsset[2]],
      [0.2, 6, cardsset[2]],
      [0.2, 6, cardsset[2]],
      [0.1, 6, cardsset[2]],
      [0.1, 6, cardsset[2]],
      [0.1, 6, cardsset[2]],
      [0.05, 6, cardsset[2]],
      [0.05, 6, cardsset[2]],
      [0.05, 6, cardsset[2]],
      [0.05, 6, cardsset[2]],
    ]
    var actual_level = that.data.level;
    if (actual_level >= 51) {
      actual_level == 50    //最快50关，再高了就没有意义了。但是游戏本身还是会显示level往上张，但难度不会再增加了
    };
    var cardsquantity = difficulty[actual_level-1][1];
    var intervalwaitingtime = difficulty[actual_level-1][0]*1000;
    var allcards = [];
    //判断cardsset里面是一对值，还是几对值
    if (typeof(difficulty[actual_level - 1][2][0])=='number') {   //1对值
      for (var i = difficulty[actual_level - 1][2][0]; i <= difficulty[actual_level - 1][2][1]; i++) {
        allcards.push(String(i));
      }
    }
    else {
      for (var s = 0; s < difficulty[actual_level - 1][2].length; s++) {
        for (var i = difficulty[actual_level - 1][2][s][0]; i <= difficulty[actual_level - 1][2][s][1]; i++) {
          allcards.push(String(i));
        }
      }
    }
    that.setData({
      cardsquantity: cardsquantity,
      intervalwaitingtime: intervalwaitingtime,
      allcards: allcards,
      bigcardsidlist: that.getRandomArrayElements(allcards, cardsquantity)
    });
  },

  setGameParameters: function (that) {
    that.setData({
      playing: true,
      complete: false,
      allsmallcardsonbigcards: false,
      allbigcardsclosed: true,
      cardnumber: 0,
      smallcardsinitposition: []
    });
    for (var i = 0; i < that.data.cardsquantity; i++) {
      that.data.bigcards[i].url = '../../images/' + '0' + '.png';
      that.data.bigcards[i].underwhichsmallcard = 'n';     //记录大牌上的小牌sn，''代表没有小牌, 数字代表在第几张小牌在上面
      that.data.bigcards[i].match = false;     //记录大牌与小牌是否对应
      that.data.smallcards[i].url = '../../images/' + '0' + '.png';
      that.data.smallcards[i].onwhichbigcard = 'n';     //记录小牌的位置，''代表在原位置, 数字代表在第几张大牌的上面
    }
    that.setData({
      bigcards: that.data.bigcards,
      smallcards: that.data.smallcards,
    });

  },

  dealCards: function () {
    var that = this;
    that.resetCards();
    that.setGameParameters(that);
    var interval = setInterval(function () {
      if (that.data.cardnumber == that.data.cardsquantity) {
        //大牌打乱顺序赋给小牌变量
        that.data.smallcardsidlist = that.getRandomArrayElements(that.data.bigcardsidlist, that.data.cardsquantity);
        that.setData({
          smallcardsidlist: that.data.smallcardsidlist
        });
        //所有大牌先显示反面
        for (var i = 0; i < that.data.cardsquantity; i++) {
          app.playAudio('audiodealsmallcards');
          that.data.bigcards[i].url = '../../images/' + '0' + '.png';
          that.data.smallcards[i].url = '../../images/' + that.data.smallcardsidlist[i] + '.png';
          //          that.data.bigcards[i].x = (i % that.data.cardsquantity + 0.5) * that.data.smallcardwidth;
          that.data.smallcards[i].width = that.data.smallcardwidth;
          that.data.smallcards[i].height = that.data.smallcardheight;
          var XY = that.getSmallcardXY(that.data.cardsquantity, i, that.data.smallcardwidth, that.data.smallcardheight, smallcardsinterval, desktopmargintop, that.data.cardsquantity, that.data.bigcardwidth, that.data.bigcardheight, bigcardsinterval, that.data.cardsperrow);
          that.data.smallcards[i].x = XY[0];
          that.data.smallcards[i].y = XY[1];
          that.data.smallcardsinitposition.push(XY);
          that.setData({
            bigcards: that.data.bigcards,
            smallcards: that.data.smallcards,
            smallcardsinitposition: that.data.smallcardsinitposition
          });
        };
        clearInterval(interval);
      }
      else {
        //每隔一段时间亮1张牌
        app.playAudio('audiodealbigcards');
        that.data.bigcards[that.data.cardnumber].url = '../../images/' + that.data.bigcardsidlist[that.data.cardnumber] + '.png';
        that.data.bigcards[that.data.cardnumber].width = that.data.bigcardwidth;
        that.data.bigcards[that.data.cardnumber].height = that.data.bigcardheight;
        //计算每张牌的中心位置
        var XY = that.getBigcardXY(that.data.cardsquantity, that.data.cardnumber, that.data.bigcardwidth, that.data.bigcardheight, bigcardsinterval, desktopmargintop, that.data.cardsperrow);
        that.data.bigcards[that.data.cardnumber].x = XY[0];
        that.data.bigcards[that.data.cardnumber].y = XY[1];
        that.setData({
          bigcards: that.data.bigcards,
          cardnumber: that.data.cardnumber + 1
        });
      }
    }, that.data.intervalwaitingtime);
  },

  getSmallcardXY: function (cardsquantity, cardsn, cardwidth, cardheight, cardsinterval, margintop, cardsperrow, bigcardwidth, bigcardheight, bigcardsinterval, bigcardsperrow) {   //根据总牌数量、每行最多有几张牌、现在一行有几张、这张牌是第几张、牌的宽度和高度、间隔宽度来计算这张牌的中心X座标
    //先算奇数张牌时，中心牌的位置
    var desktopCenterX = this.data.desktopWidth / 2;
    var bigcardrows = cardsquantity % bigcardsperrow == 0 ? parseInt(cardsquantity / bigcardsperrow) : parseInt(cardsquantity / bigcardsperrow)+1;  //这些牌要摆几行
//    var cardrow = parseInt(cardsn / cardsperrow)    //这张牌放第几行（以0为第一行）
    //前面摆满了的行，均匀分布。最后摆不满的行，居中摆
//    var lastrowcolumns = cardsquantity % cardsperrow == 0 ? cardsperrow : cardsquantity % cardsperrow;  //剩下最后一行的牌要摆几张
    var cardcolumn = cardsn % cardsperrow                //这张牌放第几列（以0为第一列）
//    var cardsonrow = (cardrow + 1) != rows ? cardsperrow : lastrowcolumns;                                     //不是最后一行的牌，就把这一行能摆的牌数量设成是最后几张牌的数量，否则就是cardsperrow
    var x = desktopCenterX + (cardcolumn - (cardsperrow - 1) / 2) * (cardwidth + cardsinterval);
    var y = bigcardrows * (bigcardheight + margintop) + margintop + cardheight/2;    //行数*（大牌高+上边距）+上边距+半个小牌高
    return [x, y];
  },

  getBigcardXY: function (cardsquantity, cardsn, cardwidth, cardheight, cardsinterval, margintop, cardsperrow) {   //根据总牌数量、每行最多有几张牌、现在一行有几张、这张牌是第几张、牌的宽度和高度、间隔宽度来计算这张牌的中心X座标
    //先算奇数张牌时，中心牌的位置
    var desktopCenterX = this.data.desktopWidth / 2;
    var rows = cardsquantity % cardsperrow == 0 ? parseInt(cardsquantity / cardsperrow) : parseInt(cardsquantity / cardsperrow) + 1;  //这些牌要摆几行
    var cardrow = parseInt(cardsn / cardsperrow)    //这张牌放第几行（以0为第一行）
//前面摆满了的行，均匀分布。最后摆不满的行，居中摆
    var lastrowcolumns = cardsquantity % cardsperrow == 0 ? cardsperrow : cardsquantity % cardsperrow;  //剩下最后一行的牌要摆几张
    var cardcolumn = cardsn  % cardsperrow                //这张牌放第几列（以0为第一列）
    var cardsonrow = (cardrow+1) != rows ? cardsperrow : lastrowcolumns;                                     //不是最后一行的牌，就把这一行能摆的牌数量设成是最后几张牌的数量，否则就是cardsperrow
    var x = desktopCenterX + (cardcolumn-(cardsonrow-1)/2)*(cardwidth+cardsinterval);
    var y = (cardrow + 1)*(cardheight+margintop)-cardheight/2;    //行数*（牌高+上边距）-半个牌高
    console.log('y: '+y)
    return [x, y];
  },

  showCards: function () {
    var that = this;
    //所有大牌翻成正面
    this.setData({
      allbigcardsclosed: false
    })
    for (var i = 0; i < that.data.cardsquantity; i++) {
      that.data.bigcards[i].url = '../../images/' + that.data.bigcardsidlist[i] + '.png';
      that.setData({
        bigcards: that.data.bigcards
      });
    }
    //不能再点开牌
    this.setData({
      allsmallcardsonbigcards: false
    })
    that.checkMatches();
  },

  smallcardClick: function (e) {
    //    console.log('click');
  },

  smallcardMoveEnd: function (e) {                 //pageX、Y是屏幕上的坐标，要转换成可移动区域的相对坐标
    var sn = e.target.id.slice(5);
    var endpointX = e.changedTouches[0].pageX < 0 ?
      this.data.smallcardwidth / 2
      : (e.changedTouches[0].pageX > this.data.desktopWidth ?
        this.data.desktopWidth - this.data.smallcardwidth / 2
        : e.changedTouches[0].pageX);
    var endpointY = e.changedTouches[0].pageY - this.data.movableareatop < 0 ?
      this.data.smallcardheight / 2
      : (e.changedTouches[0].pageY - this.data.movableareatop > this.data.desktopHeight ?
        this.data.desktopHeight - this.data.smallcardheight / 2
        : e.changedTouches[0].pageY - this.data.movableareatop);
    this.setData({
      smallcardsn: sn,
      touchEnd: [endpointX, endpointY]
    });
    this.checkOverlap(this.data.smallcardsn, this.data.touchEnd)
  },

  checkOverlap: function (sn, endpoint) {
    for (var i = 0; i < this.data.cardsquantity; i++) {
      if (         //endpointX在bigcards[i]的左右边框内，且Y也在边框内，就把牌摆在i上
        (this.data.bigcards[i].x + this.data.bigcardwidth * 0.5) > endpoint[0] && (this.data.bigcards[i].x - this.data.bigcardwidth * 0.5) < endpoint[0]
        &&
        (this.data.bigcards[i].y + this.data.bigcardheight * 0.5) > endpoint[1] && (this.data.bigcards[i].y - this.data.bigcardheight * 0.5) < endpoint[1]
      ) {
        var source_bigcard = this.data.smallcards[sn].onwhichbigcard;        //源小牌放在哪张大牌上
        var source_smallcard = sn;
        var target_bigcard = i;
        var target_smallcard = this.data.bigcards[i].underwhichsmallcard;     //目的大牌上原来的小牌号
        if (source_smallcard != target_smallcard){    //小牌如果还在原来的大牌上，不算移动
          this.setSmallcard(target_bigcard, source_smallcard);
          this.setSmallcard(source_bigcard, target_smallcard);
          this.checksmallcardsset();
        }
        break;
      }
    }
    //小牌没有停靠一张大牌，就回原位
    this.setData({
      smallcards: this.data.smallcards
    });
  },

/*
*/

  setSmallcard: function (i, sn) {
    wx.vibrateShort();
    if (i == 'n' && sn == 'n') {  //什么都不动
    };
    if (i == 'n' && sn != 'n') {  //小牌回初始位
      this.data.smallcards[sn].x = this.data.smallcardsinitposition[sn][0];
      this.data.smallcards[sn].y = this.data.smallcardsinitposition[sn][1];
      this.data.smallcards[sn].onwhichbigcard = i;   //记录小牌摆在第几张大牌上面了
    };
    if (i != 'n' && sn == 'n') {  //大牌上面的小牌移走了
      this.data.bigcards[i].underwhichsmallcard = sn;   //记录大牌上面摆的是第几张小牌
    };
    if (i != 'n' && sn != 'n') {  //大牌上摆一张小牌
      app.playAudio('audiodropcards');
      this.data.smallcards[sn].x = this.data.bigcards[i].x;
      this.data.smallcards[sn].y = this.data.bigcards[i].y;
      this.data.smallcards[sn].onwhichbigcard = i;   //记录小牌摆在第几张大牌上面了
      this.data.bigcards[i].underwhichsmallcard = sn;   //记录大牌上面摆的是第几张小牌
    };
    this.setData({
      smallcards: this.data.smallcards,
      bigcards: this.data.bigcards
    })
  },

  checksmallcardsset: function() {
    var emptybigcards = 0;   //空着的大牌数量
    var last_bigcard = 0;
    for (var i = 0; i < this.data.cardsquantity; i++) {
      if (this.data.bigcards[i].underwhichsmallcard == 'n') {
//如果还剩最后一张小牌没有摆，就自动摆到空着的大牌上
        emptybigcards += 1;  //计数
        last_bigcard = i;
      }
    };
    if (emptybigcards>1) {
      //超过1张小牌没有摆完，不能亮牌，也不能过关
      this.setData({
        allsmallcardsonbigcards: false
      })
      return
    }
    if (emptybigcards == 1) {   //最后一张小牌，自动摆上
      for (var i = 0; i < this.data.cardsquantity; i++) {
        if (this.data.smallcards[i].onwhichbigcard == 'n') {
          var last_smallcard = i;
          this.setSmallcard(last_bigcard, last_smallcard);
          this.checksmallcardsset();
        }
      }
    }
    if (emptybigcards == 0) {   //最后一张小牌，自动摆上
      this.setData({
        allsmallcardsonbigcards: true
      })
    }
  },

  checkMatches: function () {
    //如果小牌跟大牌匹配了，才过关
    var complete = true;
    for (var i = 0; i < this.data.cardsquantity; i++) {
      this.data.bigcards[i].match = (this.data.bigcardsidlist[i] == this.data.smallcardsidlist[this.data.bigcards[i].underwhichsmallcard]);
      if (!this.data.bigcards[i].match) {
        complete = false;
      }
    }
    wx.vibrateLong();
    if (complete) {
      app.playAudio('audiocomplete');
      this.setData({
        bigcards: this.data.bigcards,
        complete: true,
        level: this.data.level + 1,
        score: this.data.score + 100,
        playing: false,
      })
//      wx.showToast({
//        title: '好棒啊!  ' + this.data.score,
//        icon: 'success',
//        duration: 800,
//      });
      return true;
    }
    else {
      app.playAudio('audiofailed');
      wx.vibrateLong();
      this.setData({
        bigcards: this.data.bigcards,
        score: this.data.score <= 100 ? 0 : this.data.score - 200
      })
      return false;
    }
  },

  saveGame: function () {
    if (this.data.level == 1) {   //第一关就不要保存了
      return;
    }
    wx.setStorage({
      key: "gameinfo",
      data: this.data      
    });
    wx.showToast({
      title: '游戏已保存',
      icon: 'success',
      duration: 500  
    })
  },

  restoreGame: function () {
    var that = this;
    wx.getStorage({
      key: "gameinfo",
      success: function(res){
        if (res.data.level == 1){   //第一关就不要恢复了
          wx.showModal({
            title: '没什么可恢复啊',
            content: '你什么都没有保存',
          });
          return;
        }
        that.setData({
          allbigcardsclosed: res.data.allbigcardsclosed,
          allcards: res.data.allcards,
          allsmallcardsonbigcards: res.data.allsmallcardsonbigcards,
          bigcardheight: res.data.bigcardheight,
          bigcards: res.data.bigcards,
          bigcardsidlist: res.data.bigcardsidlist,
          bigcardwidth: res.data.bigcardwidth,
          cardnumber: res.data.cardnumber,
          cardsquantity: res.data.cardsquantity,
          cardspercolumn: res.data.cardspercolumn,
          cardsperrow: res.data.cardsperrow,
          complete: res.data.complete,
          desktopHeight: res.data.desktopHeight,
          desktopWidth: res.data.desktopWidth,
          intervalwaitingtime: res.data.intervalwaitingtime,
          level: res.data.level,
          message: res.data.message,
          playing: res.data.playing,
          score: res.data.score,
          smallcardheight: res.data.smallcardheight,
          smallcards: res.data.smallcards,
          smallcardsidlist: res.data.smallcardsidlist,
          smallcardsinitposition: res.data.smallcardsinitposition,
          smallcardsn: res.data.smallcardsn,
          smallcardwidth: res.data.smallcardwidth,
          touchEnd: res.data.touchEnd
        });
      },
    })
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

//  getCardWidth: function () {
//    const { screenWidth, screenHeight, devicePixelRatio } = wx.getSystemInfoSync();
//    return screenWidth / this.data.cardsperrow;
//  },

//  getCardHeight: function () {
//    const { screenWidth, screenHeight, devicePixelRatio } = wx.getSystemInfoSync();
//    return screenWidth / this.data.cardsperrow / 2 * 3 - 27;
//  },

  callOwner: function() {
    const ctx = wx.createCanvasContext('myCanvas')
    console.log(ctx)
    ctx.setFillStyle('red')
    ctx.fillRect(10, 10, 150, 75)
    ctx.draw()
  },

  getMovableareaTop: function () {    //把可移动view的top查出来，因为里面的牌的XY都是相对坐标
    var that = this;
    var query = wx.createSelectorQuery()//创建节点查询器 query
    query.select('#movablearea').boundingClientRect()//这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
//    query.selectViewport().scrollOffset()//这段代码的意思是获取页面滑动位置的查询请求
    query.exec(function (res) {
      var movableareatop = res[0].top       // #the-id节点的上边界坐标
      console.log('movablearea: ' + movableareatop)
      that.setData({
        movableareatop: movableareatop,
      });
    })
  }

})
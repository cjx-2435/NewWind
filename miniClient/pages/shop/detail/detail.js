// pages/shop/detail/detail.js
import { request } from"../../../request/promise.js"
import { goodsDetail } from"../../../request/api.js"
import { showToast } from"../../../utils/asyncWx.js"
import regeneratorRuntime, { async } from"../../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    num:1
  },
  GoodsInfo:{},
  async getGoodsDetail(goods_id){
    const goodsObj = await request({
      url:"/public/goods/detail",
      data:{goods_id}
    });
    // const goodsObj = await goodsDetail(goods_id)
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce,
        pics:goodsObj.pics,
        attrs: goodsObj.attrs
      }
    })
  },
  handlePrevewImage(e){
    const urls = this.GoodsInfo.pics.map(v=>v.pics_big);
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.previewImage({
      current:urls[index],
      urls: urls,
    })
  },
  /* 加数 */
  addCount: function (e) {
    console.log("刚刚您点击了加1");
    var num = this.data.num;
    // 总数量-1  
    if (num < 1000) {
      this.data.num++;
    }
    // 将数值与状态写回  
    this.setData({
      num: this.data.num
    });
  },
/* 减数 */
delCount: function (e) {
  console.log("刚刚您点击了减1");
  var num = this.data.num;
  // 商品总数量-1
  if (num > 1) {
    this.data.num--;
  }
  // 将数值与状态写回  
  this.setData({
    num: this.data.num
  });
},
  //加入购物车
  handleCartAdd(){
    console.log("点击加入购物车");
    let cart = wx.getStorageSync('cart')||[];
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      this.GoodsInfo.cartNum = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else{
      cart[index].cartNum++;
    }
    wx.setStorageSync("cart", cart);
    showToast({
      title:"加入成功",
      mask: true,
      icon: 'success'
    })
  },

  //点击我显示底部弹出框
clickme:function(){
  this.showModal();
},

//显示对话框
 showModal: function () {
   // 显示遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
     showModalStatus: true
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export()
     })
   }.bind(this), 200)
 },
 //隐藏对话框
 hideModal: function () {
   // 隐藏遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export(),
       showModalStatus: false
     })
   }.bind(this), 200)
 },
 parameterTap:function(e){//e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
  let that=this
  let this_checked = e.currentTarget.dataset.id
  var parameterList = this.data.goodsObj.attrs//获取Json数组
  for (var i = 0; i < parameterList.length;i++){
    if (parameterList[i].attr_id == this_checked){
      parameterList[i].checked = true;//当前点击的位置为true即选中
    }
    else{
      parameterList[i].checked = false;//其他的位置为false
    }
  }
  this.setData({
    goodsObj:{
      goods_name:this.data.goodsObj.goods_name,
      goods_price:this.data.goodsObj.goods_price,
      goods_introduce:this.data.goodsObj.goods_introduce,
      pics:this.data.goodsObj.pics,
      attrs: parameterList
    }
  })
  // this.data.goodsObj.attrs=parameterList
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options;
    this.getGoodsDetail(goods_id)
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
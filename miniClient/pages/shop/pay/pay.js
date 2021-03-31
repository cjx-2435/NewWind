import { chooseAddress,showModal,showToast } from "../../../utils/asyncWx.js";
import regeneratorRuntime, { async } from "../../../lib/runtime/runtime.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    try {
      let cart = wx.getStorageSync("cart")||[];
      cart = cart.filter(v=>v.checked)
      let address = wx.getStorageSync('address');
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      let totalPrice = 0;
      let totalNum = 0;
      cart.forEach(v=>{
        totalPrice += v.cartNum*v.goods_price;
        totalNum += v.cartNum;
      })
      this.setData({
        address,cart,totalPrice,totalNum
      });
      } catch (error) {
        console.log(error);
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});

// pages/shop/order/index.js
//options参数只能在onload不能再onshow获得
import { request } from"../../../request/promise.js"
import { } from"../../../utils/asyncWx.js"
import regeneratorRuntime, { async } from"../../../lib/runtime/runtime.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"全部",
        isActive: true
      },
      {
        id:1,
        name:"待付款",
        isActive: false
      },
      {
        id:2,
        name:"待收货",
        isActive: false
      },
      {
        id:3,
        name:"退款退货",
        isActive: false
      }
    ],
    orders:[]
  },
  changeTitleByIndex(index){
    let {tabs} = this.data;
    tabs.forEach((v,i)=>v.isActive=(i===index))
    this.setData({
      tabs
    }) 
  },
  handleItemchange(e){
    //console.log(e)
    const {index} = e.detail;
    this.changeTitleByIndex(index)
    this.getOrders(index+1)
  },
  async getOrders(type,token){
    const header = {Authorization:token};
    const res = await request({
      url:"/private/my/orders",
      method:"post",
      data:{
        type
      },
      header
    })
    this.setData({
      orders:res.orders.map(v=>({...v,
        create_time_cn:(new Date(v.create_time*1000).toLocaleDateString()),
      }))
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const token = wx.getStorageSync('token')
    if(!token){
      wx.navigateTo({
        url: '/pages/login/index',
      })
     return;
    }
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    const {type} = currentPage.options;
    this.getOrders(Number(type),token);
    this.changeTitleByIndex(Number(type)-1);
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
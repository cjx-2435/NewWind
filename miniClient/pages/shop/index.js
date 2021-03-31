// pages/shop/index.js
import { request } from"../../request/promise.js"
import { showToast } from"../../utils/asyncWx.js"
import regeneratorRuntime, { async } from"../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"全部",
        isActive:true
      },
      {
        id:1,
        name:"整机",
        isActive:false
      },
      {
        id:2,
        name:"配件",
        isActive:false
      },
    ],
    goodsList:[]
  },
  QueryParam:{
    query:"",
    cid: "0",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,
  
  handleItemchange(e){
    //console.log(e)
    const {index} = e.detail;
    console.log(index)
    let {tabs} = this.data;
    tabs.forEach((v,i)=>v.isActive=(i===index))
    this.setData({
      tabs
    }) 

    //todo 切换分页，重置list totalPages cid 重新请求数据
  },
  //获取商品列表数据
  async getGoodsList(){
    const res = await request({
      url:"/public/goods/search",
      data:this.QueryParam
    })
    const total = res.total;
    this.totalPages = Math.ceil(total/this.QueryParam.pagesize)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    });
    wx.stopPullDownRefresh();
  },
  /**
   * 页面触底事件
   * 可以在app.json的window选项中或页面配置中设置触发距离onReachBottomDistance
   * 在触发距离内滑动期间，本事件只会被触发一次。
   */
  onReachBottom(){
    if(this.QueryParam.pagenum >= this.totalPages){
      //没有下一页数据
      showToast({title:'没有下一页了'})
    }else{
      this.QueryParam.pagenum++;
      this.getGoodsList()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList()

    
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
    this.setData({
      goodsList:[]
    });
    this.QueryParam.pagenum = 1;
    this.getGoodsList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})
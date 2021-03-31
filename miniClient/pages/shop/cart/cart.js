import { chooseAddress,showModal,showToast } from "../../../utils/asyncWx.js";
import regeneratorRuntime, { async } from "../../../lib/runtime/runtime.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  /**
   * 点击获取收货地址
   */
  async handleChooseAddress() {
    //获取用户权限 状态
    try{
     const address = await chooseAddress();
     wx.setStorageSync("address", address); 
    }catch(error){
      console.log(error);
    }
  },
  //选中被点击
  handleItemChange(e){
    const goods_id = e.currentTarget.dataset.id;
    let {cart} = this.data;
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    cart[index].checked = !cart[index].checked
    this.refreshState(cart);
  },
  //全选
  handleItemAllCheck(){
    let {cart,allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.refreshState(cart);
  },
  //修改数量
  async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id===id);
    cart[index].cartNum+=operation;
    if(cart[index].cartNum === 0){
      const res = await showModal({content:'是否要删除商品'})
      if(res.confirm){
        cart.splice(index,1);
      }else if(res.cancel){
        cart[index].cartNum = 1;
      }this.refreshState(cart);
    }else{
      this.refreshState(cart);
    }
  },
  //结算
  async handlePay(){
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({
        title:"没有收货地址"
      });
      return;
    }
    if(totalNum === 0){
      await showToast({
        title:"没有商品"
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/shop/pay/pay'
    });
  },
  //状态刷新
  refreshState(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.cartNum*v.goods_price;
        totalNum += v.cartNum;
      }else{
        allChecked = false;
      }
    })
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,totalPrice,totalNum,allChecked
    });
    wx.setStorageSync('cart', cart);
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
      const cart = wx.getStorageSync("cart")||[];
      this.refreshState(cart)
      let address = wx.getStorageSync('address');
      if(address){
        address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
        this.setData({address})
      }
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

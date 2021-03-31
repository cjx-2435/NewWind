// pages/console/index.js
import { request } from "../../request/promise.js";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime.js";
import { showToast } from"../../utils/asyncWx.js"

//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    client: null,
    socketStatus: "closed",
    //轮播图数组
    swiperList: [],
    tipList: ["室内温度", "室内湿度", "CO2含量", "PM2.5指数", "甲醛浓度"],
    tipExplain: [
      "相对适宜温度",
      "相对适宜湿度",
      "等级标准",
      "等级标准",
      "等级标准",
    ],
    tipExplainValue: [
      ["夏季：23℃~28℃", "冬季：18℃~25℃"],
      ["夏季：30%~60%", "冬季：30%~80%"],
      ["一级：≤0.1%", "二级：≤0.15%"],
      ["一级：≤35μg/m³", "二级：≤75μg/m³"],
      ["一级：≤0.08mg/m³", "二级：≤0.1mg/m³"],
    ],
    dataList: ["无", "无", "无", "无", "无"],
    dataDate: "没有登录或者试一下刷新",
    runningmode: "暂无数据",
    qualityRate: "空气质量 ***",
    deviceId:""
  },
  async getSwiper() {
    const res = await request({
      url: "/public/swiperdata",
    });
    console.log(res);
    this.setData({
      swiperList: res,
    });
    wx.stopPullDownRefresh()
  },
  async getData() {
    //const token = wx.getStorageSync("token");
    let device_id = wx.getStorageSync("device_id");
    if ( !device_id) {
      console.log("不存在device_id");
      device_id = this.data.deviceId
    }
    console.log("has token and device_id");
    //const header = { Authorization: token };
    const res = await request({
      customBaseUrl: "https://fresh-air.zhipu-china.com:20111/api/device/getLatestDevData/",
      url: device_id
      //header
    });
    let mode = "暂无数据";
    let dataArray = [];
   
    //todo
    /* if (res.running_mode === 1) {
      mode = "有人模式";
    } else {
      mode = "无人模式";
    } */

    
    if(res.msg){
      dataArray[0] = res.msg.Temp + "℃";
      dataArray[1] = res.msg.Humidity + "%RH";
      dataArray[2] = res.msg.CO2/10000 + "%";
      dataArray[3] = res.msg.PM25 + "μg/m³";
      dataArray[4] = res.msg.Hcho/1000 + "mg/m³";
      this.setAirLevel(res.msg.CO2/10000,res.msg.PM25,res.msg.Hcho/1000);
      this.setData({
        runningmode: mode,
        dataList: dataArray,
        dataDate: res.msg.UploadTime.substring(0,res.msg.UploadTime.indexOf(".")).replace("T"," ")
      });
      this.setRunModel(res.msg.RunModeCode);
    }
    wx.stopPullDownRefresh();
  },
  setAirLevel(co2,pm25,hcoh){
    let qualityRate = "";
    if (co2 <= 0.1 && pm25 <= 35 && hcoh <= 0.08) {
      qualityRate= "空气质量 一级"
    }else if (co2 > 0.15 || pm25 > 75 || hcoh > 0.1){
      qualityRate= "空气质量 三级"
    }else{
      qualityRate= "空气质量 二级"
    }
    this.setData({
      qualityRate
    })
  },
  async setRunModel(runMode){
    const {runModeList} = await request({
      url:"/public/runmodelist"
    });
    wx.setStorageSync('run_model_list', runModeList)
    console.log(runModeList);
    console.log(runMode);
    let runningmode =""
    runModeList.forEach(v=>{
      if(v.value === runMode){
        runningmode = v.text;
      }
    })
    this.setData({
      runningmode
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    //const scene = decodeURIComponent(query.scene);

    //二维码url解码
    let scan_url = decodeURIComponent(query.q);
    //获取设备id参数
    const devive_id = query.q?(scan_url.split("?")[1].split("=")[1]):"设备号为空"; 
    wx.setStorageSync('device_id', devive_id);
    this.setData({
      deviceId:devive_id
    })

    var that = this;
    this.data.client = app.globalData.client;
    that.data.client.on('connect', that.ConnectCallback);
    /**
     * function (topic, message, packet) {}
        客户端收到发布数据包时发出
        topic 接收报文的主题
        message 接收到的数据包的有效载荷
        packet接收的数据包，如mqtt-packet中所定义
     */
    that.data.client.on("message", that.MessageProcess);
    that.data.client.on("error", that.ConnectError);
    that.data.client.on("reconnect", that.ClientReconnect);
    that.data.client.on("offline", that.ClientOffline);
    that.data.client.on("close",that.ClientClose);

    //test
    //that.data.client.on("packetsend",that.ClientPacketsend);
    //that.data.client.on("packetreceive",that.ClientPacketreceive);

    //const token = wx.getStorageSync("token");
    //if (query.scene) {
      //const scene = decodeURIComponent(query.scene);
      //console.log(scene);
      //const devive_id = scene.split("=")[1] 
      //wx.setStorageSync("device_id", devive_id);
      /* if(!token){
        wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
      }  */
    //}else{
      
    //}
    //wx.setStorageSync('token', "test token")
    //wx.setStorageSync('device_id', "aaabbbbcccddd002")
    this.getSwiper().then(res=>{
      console.log(res);
    },err=>{
      console.log(err);
    });
    console.log("onload");
  },

  MessageProcess: function(topic, payload) {
    /* var that = this;

    var payload_string = payload.toString();
      if (topic == that.data.topic.HumdTopic) {
        that.setData({
          'value.HumdValue': payload_string
        })
      }
      if (topic == that.data.topic.TempTopic) {
        that.setData({
          'value.TempValue': payload_string
        })
      } */
      console.log("MessageProcess");
      console.log(payload.toString());
      const data = JSON.parse(payload.toString())
      const dataValue = JSON.parse(data.Data)
      console.log(data.UploadTime.toString().substring(6,19));
      const dataDate = new Date(Number(data.UploadTime.toString().substring(6,19))).toISOString().substring(0,19).replace("T"," ");
      this.setData({
        dataList:[
          dataValue.Temp + "℃",
          dataValue.Humidity + "%RH",
          dataValue.CO2/10000 + "%",
          dataValue.PM25+ "μg/m³",
          dataValue.Hcho/1000+ "mg/m³",
        ],
        dataDate
      })
      this.setAirLevel(dataValue.CO2/10000,dataValue.PM25,dataValue.Hcho/1000)
  },

  ConnectCallback: function(connack) {
    /* var that = this;
    // console.log("connect callback ");
    for (var v in that.data.topic) {
      that.data.client.subscribe(that.data.topic[v], {
        qos: 1
      });
    } */
    const devid = wx.getStorageSync('device_id');
    this.data.client.subscribe("freshAir/devData/"+devid+"/+")
    console.log("Client ConnectCallback");
  },

  ConnectError: function(error) {
    console.log(error)
  },

  ClientReconnect: function() {
    console.log("Client Reconnect")
  },

  ClientOffline: function() {
    console.log("Client Offline")
  },
  ClientClose: function(){
    console.log("Client close")
  },
  ClientPacketsend: function(packet){
    console.log(packet);
  },
  ClientPacketreceive: function(packet){
    console.log(packet);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    console.log(wx.env);
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
  onPullDownRefresh: function () {
    this.setData({
      dataList: ["无", "无", "无", "无", "无"],
      dataDate: "没有登录或者试一下刷新",
      runningmode: "暂无数据",
      qualityRate: "空气质量 ***",
    });
    this.getData();
    this.getSwiper();
    
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});

// components/tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //要放一个接收数据的名称
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      const {index} = e.currentTarget.dataset;
      //解构 复制引用而不是复制一份
      /* let {tabs} = this.data;
      tabs.forEach((v,i)=>v.isActive=(i===index))
      this.setData({
        tabs
      }) */
      /*
      子组件向父组件传递事件
      this.triggerEvent("父组件自定义事件的名称",要传递的参数)
      */
     this.triggerEvent("itemchange",{index});
    }
  }
})

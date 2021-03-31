import { request } from"./promise.js"
// export const swiperList = (pageId) => {
//     return request({
//         url:"/public/swiperdata",
//         data:{pages: pageId}
//       })
//   }

let baseUrl = "http://test.zhipu-china.com:20200"

module.exports = {
    // 商城首页列表
    swiperList(pageName) {
        return request({
            customBaseUrl: baseUrl,
            url:"/public/image",
            data:{pages: pageName}
        })
    },
    
    //商城二级分类
    categoryList(category) {
        return request({
            customBaseUrl: baseUrl,
            url:`/goods/${category}`
        })
    },

    // 商品详情
    goodsDetail(id) {
        request({
            customBaseUrl: baseUrl,
            url:"/goods/detail",
            data:{goodsId: id}
        })
    }
}
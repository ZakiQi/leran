/*
 * @Author: your name
 * @Date: 2021-04-23 15:39:51
 * @LastEditTime: 2021-04-28 10:32:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /lerna/packages/sd-ui/packages/mixins/mask-mixins.js
 */
// 蒙层【有下拉内容的组件，显示下拉内容猴禁止滚动】
export default {
  data () {
    return {
      show: false
    }
  },

  methods: {
    // 下拉内容出现要阻止滚动，思路是创建一个body下的mask，下拉的时候吧display设置为block，收回的时候设置为none
    // 为了避免每个时间选择器都产生一个新dom，会使用第一次创建的dom，重复利用
    maskWrap (state) {
      let maskDom = document.getElementById('sd-picker-mask')
      if (state) {
        if (maskDom) {
          maskDom.style.display = 'block'
        } else {
          let _div = document.createElement('div')
          _div.id = 'sd-picker-mask'
          _div.className = 'pick-mask'
          document.body.appendChild(_div);
        }
        this.show = true
      } else {
        this.show = false
        if (maskDom) {
          maskDom.style.display = 'none'
        }
      }
    }
  }
}
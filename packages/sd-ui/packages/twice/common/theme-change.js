/**
 * 自定义主题
 * @description 目前只能切换default和gray两种主题
 * @use this.$theme('gray')
*/
import Vue from 'vue'

// 主题
Vue.prototype.$theme = (type = 'default') => {
  const domInfo = document.querySelectorAll("body > div")
  
  domInfo.forEach(e => {
    e && e.setAttribute('class', type)
 })
}

/**
 * 自定义主题
 * @description 目前只能切换default和gray两种主题
 * @use this.$theme('gray')
*/
import Vue from 'vue'

Vue.prototype.$theme = (type = 'default') => {
  const dom = document.getElementById('app')
  dom.setAttribute('class', type)
}

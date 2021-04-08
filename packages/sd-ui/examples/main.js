import Vue from 'vue'
import App from './App.vue'

import '../element';
import previewUI from '../packages/index'

import '../packages/common/theme-change'

// import sjButton from '../packages/index'

import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.scss'
// import '../theme/global-default.scss'
console.log(previewUI)
Vue.use(previewUI)

Vue.config.productionTip = false;

let a = new Vue({
  el: '#app',
  render: h => h(App)
})

// console.log(a.changeTheme('gray'), this)

// 修改主题色
// let theme = new Theme()
// theme.themeChange('gray')

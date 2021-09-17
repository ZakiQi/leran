import Vue from 'vue'
import App from './App.vue'

import '../element';
import previewUI from '../packages/index'

import '../packages/twice/common/theme-change'

import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.scss'
// import '../theme/global-default.scss'
Vue.use(previewUI)

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: h => h(App)
})

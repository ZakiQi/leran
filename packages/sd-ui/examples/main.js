import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import previewUI from '../packages/index'

// import sjButton from '../packages/index'

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(previewUI).use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: h => h(App)
})

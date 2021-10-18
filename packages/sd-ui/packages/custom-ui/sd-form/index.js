import sdForm from './src/form.vue'

import '../scss/form.scss'

/* istanbul ignore next */
sdForm.install = function(Vue) {
  Vue.component(sdForm.name, sdForm)
}

export default sdForm

/* istanbul ignore next */
// Tooltip.install = function (Vue) {
//   Vue.component(Tooltip.name, Tooltip)
// }

import directive from './src/directive'

export default {
  install(Vue) {
    Vue.use(directive)
  },
  directive
}

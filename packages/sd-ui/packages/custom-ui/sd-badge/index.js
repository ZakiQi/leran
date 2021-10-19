import sdBadge from './src/badge'

/* istanbul ignore next */
sdBadge.install = function(Vue) {
  Vue.component(sdBadge.name, sdBadge)
}

export default sdBadge

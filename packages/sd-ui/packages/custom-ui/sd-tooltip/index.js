import sdTooltip from './src/tooltip.js'

sdTooltip.install = function(Vue) {
  Vue.component(sdTooltip.name, sdTooltip)
}

export default sdTooltip

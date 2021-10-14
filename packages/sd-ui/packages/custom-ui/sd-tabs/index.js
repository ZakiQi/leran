import sdTabs from './src/tabs'

/* istanbul ignore next */
sdTabs.install = function(Vue) {
  Vue.component(sdTabs.name, sdTabs)
}

export default sdTabs

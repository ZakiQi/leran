import sdTabPane from '../sd-tabs/src/tab-pane.vue'

/* istanbul ignore next */
sdTabPane.install = function(Vue) {
  Vue.component(sdTabPane.name, sdTabPane)
}

export default sdTabPane

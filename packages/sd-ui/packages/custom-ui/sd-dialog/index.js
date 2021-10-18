import sdDialog from './src/component'

/* istanbul ignore next */
sdDialog.install = function(Vue) {
  Vue.component(sdDialog.name, sdDialog)
}

export default sdDialog

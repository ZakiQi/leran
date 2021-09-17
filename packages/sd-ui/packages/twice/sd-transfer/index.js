import sdTransfer from './sd-transfer'

sdTransfer.install = function (Vue) {
  Vue.install(sdTransfer.name, sdTransfer)
}

export default sdTransfer
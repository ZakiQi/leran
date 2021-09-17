import sdButton from './sd-button'

sdButton.install = function (Vue) {
  Vue.components(sdButton.name, sdButton)
}

export default sdButton
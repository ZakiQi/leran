import sdFormInput from './src/input'

/* istanbul ignore next */
sdFormInput.install = function(Vue) {
  Vue.component(sdFormInput.name, sdFormInput)
}

export default sdFormInput

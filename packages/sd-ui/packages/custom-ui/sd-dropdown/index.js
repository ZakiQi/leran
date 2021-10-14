import sdDropdown from '../sd-dropdown/src/dropdown.vue'

/* istanbul ignore next */
sdDropdown.install = function(Vue) {
  Vue.component(sdDropdown.name, sdDropdown)
}

export default sdDropdown

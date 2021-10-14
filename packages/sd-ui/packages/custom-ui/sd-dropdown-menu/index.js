import sdDropdownMenu from '../sd-dropdown/src/dropdown-menu.vue'

/* istanbul ignore next */
sdDropdownMenu.install = function(Vue) {
  Vue.component(sdDropdownMenu.name, sdDropdownMenu)
}

export default sdDropdownMenu

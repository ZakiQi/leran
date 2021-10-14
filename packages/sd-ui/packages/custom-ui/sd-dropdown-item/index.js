import sdDropdownItem from '../sd-dropdown/src/dropdown-item'

/* istanbul ignore next */
sdDropdownItem.install = function(Vue) {
  Vue.component(sdDropdownItem.name, sdDropdownItem)
}

export default sdDropdownItem

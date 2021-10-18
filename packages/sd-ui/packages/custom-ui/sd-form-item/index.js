import sdFormItem from '../sd-form/src/form-item.vue'

/* istanbul ignore next */
sdFormItem.install = function(Vue) {
  Vue.component(sdFormItem.name, sdFormItem)
}

export default sdFormItem

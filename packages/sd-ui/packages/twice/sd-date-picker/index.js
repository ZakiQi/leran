import sdDataPicker from './sd-data-picker.vue'

sdDataPicker.install = function (Vue) {
  Vue.components(sdDataPicker.name, sdDataPicker)
}

export default sdDataPicker
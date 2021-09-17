import sideDialog from './sd-side-dialog'

sideDialog.install = function (Vue) {
  Vue.components(sideDialog.name, sideDialog)
}

export default sideDialog
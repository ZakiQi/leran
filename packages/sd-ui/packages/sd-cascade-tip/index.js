import sdCascadeTip from './sd-cascade-tip.vue'

sdCascadeTip.install = function (Vue) {
  Vue.components(sdCascadeTip.name, sdCascadeTips)
}

export default sdCascadeTip
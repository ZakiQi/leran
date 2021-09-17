import '../packages/twice/common/theme-change'
// import sdButton from './custom-ui/sd-button/index.js/index'
import sdInput from './twice/sd-input'
import sdSelect from './twice/sd-select'
import sdDatePicker from './twice/sd-date-picker'
import sdTransfer from './twice/sd-transfer'
import sdCascadeTip from './twice/sd-cascade-tip'
import sdButton from './custom-ui/sd-button'

// iconfont
import '../assets/iconfont/iconfont.css'
import '../assets/iconfont/iconfont.js'

const components = [
  sdButton,
  sdInput,
  sdSelect,
  sdDatePicker,
  sdTransfer,
  sdCascadeTip
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component);
  })
}
console.log(install, 'install')

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components
}

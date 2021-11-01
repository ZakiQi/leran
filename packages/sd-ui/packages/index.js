import '../packages/twice/common/theme-change'
// import sdButton from './custom-ui/sd-button/index.js/index'
import sdInput from './twice/sd-input'
import sdSelect from './twice/sd-select'
import sdDatePicker from './twice/sd-date-picker'
import sdTransfer from './twice/sd-transfer'
import sdCascadeTip from './twice/sd-cascade-tip'
import sdButton from './custom-ui/sd-button'

import sdTabs from './custom-ui/sd-tabs/index'
import sdTabPane from './custom-ui/sd-tab-pane/index'

import sdTable from './custom-ui/sd-table/index'
import sdTableColumn from './custom-ui/sd-table-column/index'

import sdDropdown from './custom-ui/sd-dropdown/index'
import sdDropdownMenu from './custom-ui/sd-dropdown-menu/index'
import sdDropdownItem from './custom-ui/sd-dropdown-item/index'

import tooltipDirective from './custom-ui/sd-tooltip/directive'
import sdTooltip from './custom-ui/sd-tooltip/index'
import sdMessage from './custom-ui/sd-message/index'
import sdDialog from './custom-ui/sd-dialog/index'

import sdForm from './custom-ui/sd-form/index'
import sdFormItem from './custom-ui/sd-form-item/index'
import sdFormInput from './custom-ui/sd-form-input'
import sdFormSelect from './custom-ui/sd-form-select/index'
import sdOption from './custom-ui/sd-option/index'

import sdBadge from './custom-ui/sd-badge/index'

import sdFormRadio from './custom-ui/sd-form-radio/index'

import sdFormRadioGroup from './custom-ui/sd-radio-group/index'
import sdFormCheckbox from './custom-ui/sd-form-checkbox/index'
import sdFormCheckboxGroup from './custom-ui/sd-form-checkbox-group/index'

// iconfont
import '../assets/iconfont/iconfont.css'
import '../assets/iconfont/iconfont.js'

const components = [
  sdButton,
  sdInput,
  sdSelect,
  sdDatePicker,
  sdTransfer,
  sdCascadeTip,
  sdTabs,
  sdTabPane,
  sdTable,
  sdTableColumn,
  sdDropdown,
  sdDropdownMenu,
  sdDropdownItem,
  sdDialog,
  sdForm,
  sdFormItem,
  sdFormInput,
  sdTooltip,
  sdFormSelect,
  sdOption,
  sdBadge,
  sdFormRadio,
  sdFormRadioGroup,
  sdFormCheckbox,
  sdFormCheckboxGroup
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function(Vue) {
  // 判断是否安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map((component) => {
    Vue.component(component.name, component)
  })

  Vue.use(tooltipDirective.directive)

  Vue.prototype.$sdMessage = sdMessage
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components
}

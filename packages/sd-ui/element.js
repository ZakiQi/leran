// element-ui 按需加载
// 导入自己需要的组件
import Vue from 'vue'

import {
  Icon,
  Pagination,
  Dialog,
  Dropdown,
  Menu,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Upload,
  Progress,
  Footer,
  Loading,
  Message,
  Scrollbar
} from 'element-ui'

const elementPlugin = [
  Icon,
  Pagination,
  Dialog,
  Dropdown,
  Menu,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Upload,
  Progress,
  Footer,
  Loading,
  Scrollbar
]

elementPlugin.forEach((e) => {
  Vue.use(e)
})

Vue.prototype.$message = Message

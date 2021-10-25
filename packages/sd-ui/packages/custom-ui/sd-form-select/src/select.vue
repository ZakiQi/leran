<template>
  <div
    class="sd-select"
    :class="[selectSize ? 'sd-select--' + selectSize : '']"
    @click.stop="toggleMenu"
    v-clickoutside="handleClose"
  >
    <sd-form-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      name="name"
      :id="id"
      :autocomplete="autoComplete || autocomplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="multiple && filterable ? '-1' : null"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="debouncedOnInputChange"
      @keydown.native.down.stop.prevent="navigateOptions('next')"
      @keydown.native.up.stop.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <i
          v-show="!showClose"
          :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
        ></i>
        <i
          v-if="showClose"
          class="el-select__caret el-input__icon el-icon-circle-close"
          @click="handleClearClick"
        ></i>
      </template>
    </sd-form-input>
    <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroy">
      <sd-select-menu ref="popper" :append-to-body="popperAppendToBody" v-show="visible">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          ref="scrollbar"
          :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading"
        >
          <sd-option :value="query" created v-if="showNewOption"> </sd-option>
          <slot></slot>
        </el-scrollbar>
      </sd-select-menu>
    </transition>
  </div>
</template>

<script>
import emitter from 'packages/utils/mixins/emitter'
import Focus from 'element-ui/src/mixins/focus'
import Locale from 'element-ui/src/mixins/locale'
import sdFormInput from 'packages/custom-ui/sd-form-input/src/input'
import sdSelectMenu from './select-dropdown.vue'
import sdOption from './option.vue'
import debounce from 'throttle-debounce/debounce'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'
import { getValueByPath, valueEquals, isIE, isEdge } from 'element-ui/src/utils/util'
import { isKorean } from 'element-ui/src/utils/shared'
export default {
  name: 'sdFormSelect',
  mixins: [emitter, Locale, Focus('reference')],

  name: 'sdFormSelect',

  componentName: 'sdFormSelect',

  components: {
    sdFormInput,
    sdSelectMenu,
    sdOption
    // ElScrollbar
  },

  inject: {
    elForm: {
      default: ''
    },

    elFormItem: {
      default: ''
    }
  },
  provide() {
    return {
      select: this
    }
  },
  directives: { Clickoutside },

  props: {
    // select input 的 name 属性	string
    name: String,
    id: String,
    value: {
      required: true
    },
    // select input 的 autocomplete 属性	string	—	off
    autocomplete: {
      type: String,
      default: 'off'
    },
    autoComplete: {
      type: String,
      validator(val) {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            "[Element Warn][Select]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          )
        return true
      }
    },
    // 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单
    automaticDropdown: Boolean,
    size: {
      type: String,
      default: 'mini'
    },
    disabled: Boolean,
    clearable: Boolean,
    // 是否可搜索
    filterable: Boolean,
    // 是否允许用户创建新条目，需配合 filterable 使用
    allowCreate: Boolean,
    // 是否正在从远程获取数据
    loading: Boolean,
    // Select 下拉框的类名	string
    popperClass: String,
    // 是否为远程搜索
    remote: Boolean,
    // 远程加载时显示的文字
    loadingText: {
      type: String,
      default: '加载中'
    },
    noMatchText: {
      type: String,
      default: '无匹配数据'
    },
    noDataText: {
      type: String,
      default: '无数据'
    },
    // 远程搜索方法
    remoteMethod: Function,
    // 自定义搜索方法
    filterMethod: Function,
    // 是否多选
    multiple: Boolean,
    // 多选时用户最多可以选择的项目数，为 0 则不限制
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      required: false
    },
    // 输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
    defaultFirstOption: Boolean,
    // 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
    reserveKeyword: Boolean,
    // 作为 value 唯一标识的键名，绑定值为对象类型时必填
    valueKey: {
      type: String,
      default: 'value'
    },
    // 多选时是否将选中值按文字的形式展示
    collapseTags: Boolean,
    // 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    _elFormItemSize() {
      return (this.sdFormItem || {}).sdFormItemSize
    },

    selectSize() {
      return this.size || this._elFormItemSize
    },

    readonly() {
      return !this.filterable || this.multiple || (!isIE() && !isEdge() && !this.visible)
    },

    // 是否显示清除按钮
    showClose() {
      // 是否多选
      let hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== ''

      let criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue

      return criteria
    },

    iconClass() {
      return this.remote && this.filterable ? '' : this.visible ? 'arrow-up is-reverse' : 'arrow-up'
    },

    debounce() {
      return this.remote ? 300 : 0
    },

    showNewOption() {
      let hasExistingOption = this.options
        .filter((option) => !option.created)
        .some((option) => option.currentLabel === this.query)
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption
    },

    selectDisabled() {
      return this.disabled || (this.sdForm || {}).disabled
    },

    propPlaceholder() {
      return typeof this.placeholder !== 'undefined'
        ? this.placeholder
        : this.t('sd.select.placeholder')
    }
  },
  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },
    propPlaceholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val
    },
    //  当选到值的时候
    value(val, oldVal) {
      this.setSelected()
      if (!valueEquals(val, oldVal)) {
        this.dispatch('sdFormItem', 'sd.form.change', val)
      }
    },
    // 监听 visible 的变化，用来显示下拉框选择的选项
    visible(val) {
      // visible 为 false 时，下拉框不可见
      if (!val) {
        // 通知父组件销毁下拉框
        this.broadcast('sdSelectDropdown', 'destroyPopper')
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        // 将这些变量都变成初始化时候的值
        this.query = ''
        this.previousQuery = null
        this.selectedLabel = ''
        this.inputLength = 20
        this.menuVisibleOnFocus = false
        this.resetHoverIndex()
        this.$nextTick(() => {
          if (this.$refs.input && this.$refs.input.value === '' && this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
        })
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate && this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel
            } else {
              this.selectedLabel = this.selected.currentLabel
            }
            if (this.filterable) this.query = this.selectedLabel
          }

          if (this.filterable) {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
        }
      } else {
        this.broadcast('sdSelectDropdown', 'updatePopper')
        if (this.filterable) {
          this.query = this.remote ? '' : this.selectedLabel
          this.handleQueryChange(this.query)
          if (this.multiple) {
            this.$refs.input.focus()
          } else {
            if (!this.remote) {
              this.broadcast('sdOption', 'queryChange', '')
              // this.broadcast('ElOptionGroup', 'queryChange')
            }

            if (this.selectedLabel) {
              this.currentPlaceholder = this.selectedLabel
              this.selectedLabel = ''
            }
          }
        }
        // 下拉框出现/隐藏时触发 visible-change 事件
        this.$emit('visible-change', val)
      }
    },
    options() {
      if (this.$isServer) return

      this.$nextTick(() => {
        this.broadcast('sdSelectDropdown', 'updatePopper')
      })

      // 如何是多选
      if (this.multiple) {
        this.resetInputHeight()
      }

      let inputs = this.$el.querySelectorAll('input')
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected()
      }
    }
  },
  data() {
    return {
      options: [],
      // 缓存选项
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      inputHovering: false,
      currentPlaceholder: '',
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false
    }
  },
  created() {
    //计算属性这边过来  `propPlaceholder`
    this.cachedPlaceHolder = this.currentPlaceholder = this.propPlaceholder

    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', [])
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '')
    }

    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange()
    })

    // option.vue 组件 过来
    this.$on('handleOptionClick', this.handleOptionSelect)
    this.$on('setSelected', this.setSelected)
  },
  mounted() {
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width
      }
    })

    const reference = this.$refs.reference

    if (this.remote && this.multiple) {
      this.resetInputHeight()
    }

    this.setSelected()
  },
  methods: {
    // ********************************************  //
    // *           工具函数相关                    * //
    // ******************************************** //

    // 点击的地方不在组件上
    handleClose() {
      this.visible = false
    },

    // 通过传入的 value 获取到它的 option
    getOption(value) {
      let option
      const StringValue = Object.prototype.toString.call(value).toLowerCase()
      const isObject = StringValue === '[object object]'
      const isNull = StringValue === '[object null]'
      const isUndefined = StringValue === '[object undefined]'

      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i]
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) ===
            getValueByPath(value, this.valueKey)
          : cachedOption.value === value
        if (isEqual) {
          option = cachedOption
          break
        }
      }

      if (option) return option
      const label = !isObject && !isNull && !isUndefined ? String(value) : ''
      let newOption = {
        value: value,
        currentLabel: label
      }
      if (this.multiple) {
        newOption.hitState = false
      }
      return newOption
    },

    // 使选项中能够出现在下拉框的可视区域，通常出现出现在最后一个
    scrollToOption(option) {
      // 获取 option 的根元素 <li> 标签
      const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el

      if (this.$refs.popper && target) {
        //  menu 就是包裹着滚动元素的 div
        const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap')
        // 滚动到可视区域
        scrollIntoView(menu, target)
      }
      // 执行滚动方法
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },

    // 设置被选中的值
    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value)
        console.log('sdasd', option)
        if (option.created) {
          this.createdLabel = option.currentLabel
          this.createdSelected = true
        } else {
          this.createdSelected = false
        }
        this.selectedLabel = option.currentLabel
        this.selected = option
        if (this.filterable) this.query = this.selectedLabel
        return
      }
      let result = []
      if (Array.isArray(this.value)) {
        this.value.forEach((value) => {
          result.push(this.getOption(value))
        })
      }
      this.selected = result
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },

    // ********************************************  //
    // *           事件相关的函数                   * //
    // ******************************************** //

    // 处理 Composition 事件  主要解决不同输入法之间的差异
    handleComposition() {},

    // 处理 `输入的查询内容发生变化` 的事件
    handleQueryChange() {},

    // 处理 change 事件
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val)
      }
    },

    // 聚焦事件处理
    handleFocus(event) {
      if (!this.softFocus) {
        if (this.automaticDropdown || this.filterable) {
          this.visible = true
          if (this.filterable) {
            this.menuVisibleOnFocus = true
          }
        }
        this.$emit('focus', event)
      } else {
        this.softFocus = false
      }
    },

    // 使 sd-form-input 失去焦点
    blur() {
      console.log('ahhahaha')
      this.visible = false
      this.$refs.reference.blur()
    },

    // 失去焦点函数处理
    handleBlur(event) {
      console.log('llll')
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false
        } else {
          this.$emit('blur', event)
        }
      }, 50)
      this.softFocus = false
    },

    // 点击清空按钮的事件 处理
    handleClearClick(event) {
      this.deleteSelected(event)
    },

    // 删除已经选中的列表项
    deleteSelected(event) {
      event.stopPropagation()
      const value = this.multiple ? [] : ''
      this.$emit('input', value)
      this.emitChange(value)
      this.visible = false
      this.$emit('clear')
    },

    // 点击 列表项触发的事件处理
    handleOptionSelect(option, byClick) {
      // 多选的时候
      if (this.multiple) {
      } else {
        this.$emit('input', option.value)
        this.emitChange(option.value)
        this.visible = false
      }
      this.isSilentBlur = byClick
      this.setSoftFocus()
      if (this.visible) return
      this.$nextTick(() => {
        this.scrollToOption(option)
      })
    },

    // 使输入框聚焦
    setSoftFocus() {
      this.softFocus = true
      const input = this.$refs.input || this.$refs.reference
      if (input) {
        input.focus()
      }
    },

    // 结合防抖，处理输入框的input
    onInputChange() {},

    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--
        this.filteredOptionsCount--
        this.options.splice(index, 1)
      }
    },

    // 重新设置 sd-form-input 的高度
    resetInputHeight() {},

    // 重新设置 sd-form-input 的宽度
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },

    // 重新设置 hover 状态
    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected)
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(
              null,
              this.selected.map((item) => this.options.indexOf(item))
            )
          } else {
            this.hoverIndex = -1
          }
        }
      }, 300)
    },

    // ********************************************  //
    // *             功能函数                      * //
    // ******************************************** //
    // 点击 select 组件触发
    toggleMenu() {
      if (!this.selectDisabled) {
        console.log('44444')
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false
        } else {
          this.visible = !this.visible
        }
        if (this.visible) {
          console.log('9')
          ;(this.$refs.input || this.$refs.reference).focus()
        }
      }
    },

    // ********************************************  //
    // *         动画钩子函数                      * //
    // ******************************************** //

    handleMenuEnter() {
      this.$nextTick(() => {})
    },
    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/select.scss';
</style>

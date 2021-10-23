import Popper from '../../sd-dropdown/vue-popper'

import { addClass, removeClass, on, off } from 'element-ui/src/utils/dom'
import { generateId } from 'element-ui/src/utils/util'
import { debounce } from 'packages/utils/util'
import Vue from 'vue'

import '../../scss/tooltip.scss'

export default {
  name: 'SdTooltip',

  mixins: [Popper],

  props: {
    // 延迟出现，单位毫秒	Number	—	0
    openDelay: {
      type: Number,
      default: 0
    },
    // Tooltip 是否可用	Boolean	—	false
    disabled: Boolean,

    // 手动控制模式，设置为 true 后，mouseenter 和 mouseleave 事件将不会生效	Boolean	—	false
    manual: Boolean,

    arrowOffset: {
      type: Number,
      default: 0
    },

    // 为 Tooltip 的 popper 添加类名	String	—	—
    popperClass: String,

    content: String,

    visibleArrow: {
      default: true
    },

    transition: {
      type: String,
      default: 'fade'
    },

    // 鼠标是否可进入到 tooltip 中	Boolean	—	true
    enterable: {
      type: Boolean,
      default: true
    },

    // Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏
    hideAfter: {
      type: Number,
      default: 0
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      tooltipId: `sd-tooltip-${generateId()}`,
      timeoutPending: null,
      focusing: false
    }
  },
  computed: {
    warpPlace() {
      // ;('sd-tooltip')
      return [`sd-tooltip--placement-${this.placement}`]
    }
  },
  beforeCreate() {
    if (this.$isServer) return
    // 挂载
    this.popperVM = new Vue({
      data: { node: '' },
      render() {
        return this.node
      }
    }).$mount()

    this.debounceClose = debounce(() => this.handleClosePopper(), 200)
  },

  render() {
    if (this.popperVM) {
      this.popperVM.node = (
        <transition name={this.transition} onAfterLeave={this.doDestroy}>
          <div
            style='display:inline-block'
            onMouseleave={() => {
              this.setExpectedState(false)
              this.debounceClose()
            }}
            onMouseenter={() => {
              this.setExpectedState(true)
            }}
            ref='popper'
            role='tooltip'
            id={this.tooltipId}
            aria-hidden={this.disabled || !this.showPopper ? 'true' : 'false'}
            v-show={!this.disabled && this.showPopper}
            class={['sd-tooltip__popper', this.warpPlace, this.popperClass]}
          >
            {/* {this.$slots.content || this.content} */}

            <div class='sd-tooltip-content'>
              <div class='sd-tooltip__arrow'></div>
              <div class='sd-tooltip__inner'>{this.$slots.content || this.content}</div>
            </div>
          </div>
        </transition>
      )
    }

    const firstElement = this.getFirstElement()
    if (!firstElement) return null

    const data = (firstElement.data = firstElement.data || {})
    data.staticClass = this.addTooltipClass(data.staticClass)

    return firstElement
  },

  mounted() {
    this.referenceElm = this.$el
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('tabindex', this.tabindex)

      // 注册
      on(this.referenceElm, 'mouseenter', this.show)
      on(this.referenceElm, 'mouseleave', this.hide)

      on(this.referenceElm, 'focus', () => {
        if (!this.$slots.default || !this.$slots.default.length) {
          this.handleFocus()
          return
        }
        const instance = this.$slots.default[0].componentInstance
        if (instance && instance.focus) {
          instance.focus()
        } else {
          this.handleFocus()
        }
      })

      on(this.referenceElm, 'blur', this.handleBlur)
      on(this.referenceElm, 'click', this.removeFocusing)
    }

    if (this.value && this.popperVM) {
      this.popperVM.$nextTick(() => {
        if (this.value) {
          this.updatePopper()
        }
      })
    }
  },

  watch: {
    focusing(val) {
      if (val) {
        addClass(this.referenceElm, 'focusing')
      } else {
        removeClass(this.referenceElm, 'focusing')
      }
    }
  },

  methods: {
    show() {
      this.setExpectedState(true)
      this.handleShowPopper()
    },

    hide() {
      this.setExpectedState(false)
      this.debounceClose()
    },

    handleFocus() {
      this.focusing = true
      this.show()
    },
    handleBlur() {
      this.focusing = false
      this.hide()
    },

    removeFocusing() {
      this.focusing = false
    },

    addTooltipClass(prev) {
      // console.log('prev', prev)
      // if (!prev) {
      //   return 'sd-tooltip'
      // } else {
      //   return 'sd-tooltip ' + prev.replace('sd-tooltip', '')
      // }
      // return 'sd-tooltip ' + prev.replace('sd-tooltip', '')
      return prev
    },

    handleShowPopper() {
      if (!this.expectedState || this.manual) return
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.showPopper = true
      }, this.openDelay)

      if (this.hideAfter > 0) {
        this.timeoutPending = setTimeout(() => {
          this.showPopper = false
        }, this.hideAfter)
      }
    },

    handleClosePopper() {
      if ((this.enterable && this.expectedState) || this.manual) return
      clearTimeout(this.timeout)

      if (this.timeoutPending) {
        clearTimeout(this.timeoutPending)
      }
      this.showPopper = false

      if (this.disabled) {
        this.doDestroy()
      }
    },

    setExpectedState(expectedState) {
      if (expectedState === false) {
        clearTimeout(this.timeoutPending)
      }
      this.expectedState = expectedState
    },

    getFirstElement() {
      const slots = this.$slots.default
      if (!Array.isArray(slots)) return null
      let element = null
      for (let index = 0; index < slots.length; index++) {
        if (slots[index] && slots[index].tag) {
          element = slots[index]
        }
      }
      return element
    }
  },

  beforeDestroy() {
    this.popperVM && this.popperVM.$destroy()
  },

  destroyed() {
    const reference = this.referenceElm
    if (reference.nodeType === 1) {
      off(reference, 'mouseenter', this.show)
      off(reference, 'mouseleave', this.hide)
      off(reference, 'focus', this.handleFocus)
      off(reference, 'blur', this.handleBlur)
      off(reference, 'click', this.removeFocusing)
    }
  }
}

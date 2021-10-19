/* eslint-disable indent */
// import { createPopper } from '@popperjs/core'
import Vue from 'vue'

const PopperJS = Vue.prototype.$isServer ? function() {} : require('./popper')
import { PopupManager } from 'packages/utils/popup'
const stop = (e) => e.stopPropagation()

import { getOffset } from 'packages/utils/dom'

/**
 * @param {HTMLElement} [reference=$refs.reference]  用来定位弹出器的参考元素。
 * @param {HTMLElement} [popper=$refs.popper] - 作为弹出器使用的HTML元素，或用于生成弹出器的配置。
 * @param {String} [placement=button]  popper接受值的位置:top(-start， -end)， right(-start， -end)， bottom(-start， -end)， left(-start， -end)
 *
 * @param {Number} [offset=0] - popper的像素量将被移位(可以是负的)。
 *
 * @param {Boolean} [visible=false] popup元素的可见性。
 *
 * @param {Boolean} [visible-arrow=false] 可见的箭头，没有风格。
 */

export default {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    // 边界
    boundariesPadding: {
      type: Number,
      default: 30
    },
    reference: {},
    popper: {},
    offset: {
      default: 0
    },
    value: Boolean,
    visibleArrow: Boolean,
    arrowOffset: {
      type: Number,
      default: 35
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false,
          eventsEnabled: true
        }
      }
    }
  },

  data() {
    return {
      showPopper: false,
      currentPlacement: ''
    }
  },

  watch: {
    // v-modle
    value: {
      immediate: true,
      handler(val) {
        this.showPopper = val
        this.$emit('input', val)
      }
    },

    showPopper(val) {
      val ? this.updatePopper() : this.destroyPopper()
      this.$emit('input', val)
    }
  },

  methods: {
    createPopper() {
      if (this.$isServer) return

      this.currentPlacement = this.currentPlacement || this.placement

      // 找不到就 不执行
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return
      }

      let options = this.popperOptions
      const popper = (this.popperElm = this.popperElm || this.popper || this.$refs.popper)

      let reference = (this.referenceElm =
        this.referenceElm || this.reference || this.$refs.reference)

      // console.log('options', options)
      // console.log('popper', popper)
      // console.log('reference', reference)

      if (!popper || !reference) return
      document.body.appendChild(this.popperElm)

      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy()
      }

      options.placement = this.currentPlacement
      options.offset = this.offset
      options.arrowOffset = this.arrowOffset

      // options.onCreate = function () {
      //   ts.$emit('created', ts)
      //   ts.resetTransformOrigin()
      //   ts.$nextTick(this.updatePopper)
      // }

      this.popperJS = new PopperJS(reference, popper, options)

      this.popperJS.onCreate(() => {
        this.$emit('created', this)
        this.resetTransformOrigin()
        this.$nextTick(this.updatePopper)
        // console.log('????????????')
      })

      if (typeof options.onUpdate === 'function') {
        this.popperJS.onUpdate(options.onUpdate)
      }
      this.popperJS._popper.style.zIndex = PopupManager.nextZIndex()

      // this.popperJS.onUpdate((c) => {
      //   const { _reference, _popper } = c.instance

      //   const offset = getOffset(_reference)
      //   // 需要被弹出节点元素
      //   const eleWidth = _reference.offsetWidth
      //   const eleHeight = _reference.offsetHeight
      //   let left = offset.left
      //   let top = offset.top

      //   // 弹出的元素
      //   const tooltipHeight = _popper.offsetHeight
      //   const tooltipWidth = _popper.offsetWidth

      //   // console.log('tooltipHeight', tooltipHeight)
      //   // console.log('tooltipWidth', tooltipWidth)
      //   // console.log('offset', offset)
      //   // console.log('eleWidth', eleWidth)

      //   // const documentHeight = document.documentElement.clientHeight
      //   // console.log('currentPlacement', this.currentPlacement)
      //   // if (this.placement === 'top-start') {
      //   //   console.log(' offset.top', offset.top)
      //   //   console.log('documentHeight', documentHeight)
      //   //   console.log('tooltipHeight', tooltipHeight)
      //   //   if (documentHeight - offset.top < tooltipHeight) {
      //   //     this.currentPlacement = 'bottom-start'
      //   //   }
      //   // }

      //   switch (this.placement) {
      //     case 'top':
      //       top = offset.top - tooltipHeight
      //       left = offset.left + eleWidth / 2 - tooltipWidth / 2
      //       break
      //     case 'top-start':
      //       top = offset.top - tooltipHeight
      //       left = offset.left - tooltipWidth
      //       break
      //     case 'top-end':
      //       top = offset.top - tooltipHeight
      //       left = offset.left + eleWidth
      //       break

      //     case 'bottom':
      //       top = offset.top + eleHeight
      //       left = offset.left + eleWidth / 2 - tooltipWidth / 2
      //       break

      //     case 'bottom-start':
      //       top = offset.top + eleHeight
      //       left = offset.left - tooltipWidth
      //       break

      //     case 'bottom-end':
      //       top = offset.top + eleHeight
      //       left = offset.left + eleWidth
      //       break

      //     default:
      //       break
      //   }

      //   // options.offset = [`${c.boundaries.right}px`, `${c.boundaries.top}px`]
      //   this.popperJS._popper.style.left = `${left}px`
      //   this.popperJS._popper.style.top = `${top}px`
      //   // this.currentPlacement = ''
      // })
      this.popperElm.addEventListener('click', stop)
    },

    orientation() {},

    updatePopper() {
      const popperJS = this.popperJS
      if (popperJS) {
        popperJS.update(() => {
          // console.log('222222222222222222222222')
        })
        if (popperJS._popper) {
          popperJS._popper.style.zIndex = PopupManager.nextZIndex()
        }
      } else {
        this.createPopper()
      }
    },

    doDestroy(forceDestroy) {
      /* istanbul ignore if */
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return
      this.popperJS.destroy()
      this.popperJS = null
    },

    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin()
      }
    },

    resetTransformOrigin() {
      if (!this.transformOrigin) return
      let placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      }
      let placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0]
      let origin = placementMap[placement]
      this.popperJS._popper.style.transformOrigin =
        typeof this.transformOrigin === 'string'
          ? this.transformOrigin
          : ['top', 'bottom'].indexOf(placement) > -1
          ? `center ${origin}`
          : `${origin} center`
    },

    beforeDestroy() {
      this.doDestroy(true)
      if (this.popperElm && this.popperElm.parentNode === document.body) {
        this.popperElm.removeEventListener('click', stop)
        document.body.removeChild(this.popperElm)
      }
    },

    deactivated() {
      this.$options.beforeDestroy[0].call(this)
    }
  }
}

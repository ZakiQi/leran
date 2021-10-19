import Vue from 'vue'
import Tooltip from './main.vue'
const TipComponent = Vue.extend(Tooltip)
const TipDirective = {}

String.prototype.pxWidth = function (font) {
  // re-use canvas object for better performance
  var canvas = String.prototype.pxWidth.canvas || (String.prototype.pxWidth.canvas = document.createElement('canvas')),
    context = canvas.getContext('2d')

  font && (context.font = font)
  var metrics = context.measureText(this)

  return metrics.width
}

TipDirective.install = (Vue) => {
  if (Vue.prototype.$isServer) return

  /**
   * 获取元素的坐标位置
   * @param el
   * @returns {{top: number, left: number}}
   */
  function getOffset(el) {
    let x = 0
    let y = 0
    let ele = el
    while (ele) {
      x += parseInt(ele.offsetLeft, 10)
      y += parseInt(ele.offsetTop, 10)
      ele = ele.offsetParent
    }
    return { top: y, left: x }
  }

  /**
   * 关闭方法
   */
  function closeTooltip(el, binding, directClose = false) {
    if (el.vm) {
      if (!binding.controled) {
        if (directClose) {
          el.vm.show = false
        } else {
          /* 延时关闭,给tip本身的鼠标事件留出时间 */
          el.closeTimer = setTimeout(() => {
            /* show设置为false,触发view改变 */
            el.vm.show = false
          }, 100)
        }
      }
    }
  }

  /**
   * 显示方法
   */
  function openTooltip(el, binding) {
    if (!el) return
    // let show = true
    // if (!binding.a) {
    //   show = false
    // }

    const show =
      binding.ellipsis &&
      !(
        binding.value &&
        parseFloat(window.getComputedStyle(el).width) &&
        String(el.bindingValue).pxWidth('normal 14px Robot') > parseFloat(window.getComputedStyle(el).width)
      )
    if (show) {
      return
    }

    if (!el.vm) {
      /* 创建一个新的tip组件实例,插入到body中 */
      el.vm = new TipComponent({
        data: {
          tip: el.bindingValue /* 支持html内容 */,
          show: true,
          place: binding.place,
        },
      }).$mount()

      // const width = el.offsetWidth

      document.getElementsByTagName('body')[0].appendChild(el.vm.$el)

      /* 给tip组件本身绑定鼠标事件,鼠标移上去之后停止关闭操作（从而允许复制tip中的内容）,鼠标移开后关闭 */
      el.vm.$el.addEventListener('mouseover', () => {
        clearTimeout(el.closeTimer)
      })
      el.vm.$el.addEventListener('mouseleave', () => {
        closeTooltip(el, binding, true)
      })
      el.vm.$el.addEventListener('click', () => {
        closeTooltip(el, binding, true)
      })
    } else {
      el.vm.show = true
      el.vm.tip = el.bindingValue
    }

    setTimeout(() => {
      /* 设置tooltip的位置 */
      const offset = getOffset(el)
      const eleWidth = el.offsetWidth
      const eleHeight = el.offsetHeight
      let left = offset.left
      let top = offset.top
      const tooltipHeight = el.vm.$el.offsetHeight
      const tooltipWidth = el.vm.$el.offsetWidth

      switch (binding.place.toUpperCase()) {
        case 'TOP':
          top = offset.top - tooltipHeight
          left = offset.left + eleWidth / 2 - tooltipWidth / 2
          break
        case 'TOPLEFT':
          top = offset.top - tooltipHeight
          left = offset.left
          break
        case 'TOPRIGHT':
          top = offset.top - tooltipHeight
          left = offset.left + eleWidth - tooltipWidth
          break
        case 'BOTTOM':
          top = offset.top + eleHeight
          left = offset.left + eleWidth / 2 - tooltipWidth / 2
          break
        case 'BOTTOMLEFT':
          top = offset.top + eleHeight
          left = offset.left
          break
        case 'BOTTOMRIGHT':
          top = offset.top + eleHeight
          left = offset.left + eleWidth - tooltipWidth
          break
        case 'LEFT':
          top = offset.top + eleHeight / 2 - tooltipHeight / 2
          left = offset.left - tooltipWidth
          break
        case 'LEFTTOP':
          top = offset.top
          left = offset.left - tooltipWidth
          break
        case 'LEFTBOTTOM':
          top = offset.top + eleHeight - tooltipHeight
          left = offset.left - tooltipWidth
          break
        case 'RIGHT':
          top = offset.top + eleHeight / 2 - tooltipHeight / 2
          left = offset.left + eleWidth
          break
        case 'RIGHTTOP':
          top = offset.top
          left = offset.left + eleWidth
          break
        case 'RIGHTBOTTOM':
          top = offset.top + eleHeight - tooltipHeight
          left = offset.left + eleWidth
          break
        default:
      }
      // 设置位置
      el.vm.$el.style.left = `${left}px`
      el.vm.$el.style.top = `${top}px`
      el.vm.$el.style.position = 'absolute'
    }, 0)
  }

  Vue.directive('tooltip', {
    /**
     * 指令第一次绑定到元素时调用
     * @param {*} el
     * @param {*} binding
     */
    bind(el, binding) {
      /* 识别触发事件 */
      if (binding.arg === 'focus') {
        binding.openTrigger = 'focus'
        binding.closeTrigger = 'blur'
      } else {
        binding.openTrigger = 'mouseenter'
        binding.closeTrigger = 'mouseleave'
      }

      // const modifiers = ['controlled', 'a']
      // Object.keys(binding.modifiers).forEach((v) => {
      //   // modifiers[v] === v && (binding.place = 'top')
      //   // binding.place = v
      //   // modifiers.includes(v) && (binding.place = 'top')
      //   modifiers.includes(v) && (binding.controled = v)
      //   modifiers.includes(v) && (binding.a || false)
      // })

      binding.place = Object.keys(binding.modifiers)[0] || 'top'
      // binding.controled = Object.keys(binding.modifiers)[1] === 'controlled'
      binding.controled = binding.modifiers['controlled'] === 'controlled'
      binding.ellipsis = binding.modifiers['ellipsis'] || false
      el.bindingValue = binding.value

      /* 绑定触发事件 */
      el.openTooltip = function () {
        openTooltip(el, binding)
      }
      el.closeTooltip = function () {
        closeTooltip(el, binding)
      }

      el.addEventListener(binding.openTrigger, el.openTooltip)
      el.addEventListener(binding.closeTrigger, el.closeTooltip)
      el.addEventListener('click', closeTooltip(el, binding))
    },
    /**
     * 被绑定元素所在的模板更新时调用
     * @param el
     * @param binding
     */
    update(el, binding) {
      /* 这里需要实时更新tooltip的值 */
      el.bindingValue = Object.prototype.toString.call(binding.value) === '[object Object]' ? binding.value.value : binding.value
    },

    /**
     * 指令与元素解绑时调用
     * @param el
     * @param binding
     */
    unbind(el, binding) {
      /* 清理工作: 例如，删除 bind() 添加的事件监听器 */
      el.removeEventListener(binding.openTrigger, el.openTooltip)
      el.removeEventListener(binding.closeTrigger, el.closeTooltip)
    },
  })
}

export default TipDirective

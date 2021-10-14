<template>
  <transition name="sd-zoom-in-top" @after-leave="doDestroy">
    <ul class="sd-dropdown-menu sd-popper" v-show="showPopper" ref="container">
      <slot></slot>
    </ul>
  </transition>
</template>

<script>
import Popper from '../vue-popper'

import getScrollBarWidth from 'packages/utils/scrollbar-width'
import { PopupManager } from 'packages/utils/popup'
import { getStyle, addClass, removeClass, hasClass } from 'packages/utils/dom'
let scrollBarWidth

export default {
  name: 'sdDropdownMenu',

  componentName: 'sdDropdownMenu',

  mixins: [Popper],

  props: {
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    }
  },

  inject: ['dropdown'],

  data() {
    return {
      bodyPaddingRight: null,
      computedBodyPaddingRight: 0,
      withoutHiddenClass: true
    }
  },

  created() {
    this.$on('updatePopper', () => {
      if (this.showPopper) this.updatePopper()
    })
    this.$on('visible', (val) => {
      this.showPopper = val
      if (val) {
        this.show()
      } else {
        this.hide()
      }
    })
  },

  mounted() {
    // console.log('this.$el', this.$el)
    this.dropdown.popperElm = this.popperElm = this.$el
    this.referenceElm = this.dropdown.$el
    this.dropdown.initDomOperation()
  },
  methods: {
    show() {
      if (this.dropdown.trigger === 'click') {
        PopupManager.openModal(
          this.dropdown.listId,
          PopupManager.nextZIndex(),
          document,
          undefined,
          true
        )
      }

      if (this.dropdown.modal) {
        // todo modal 隐藏遮罩层的 条件
        document.getElementsByClassName('v-modal')[0].style.background = 'transparent'
        this.dropdown.resetTabindex(document.getElementsByClassName('v-modal')[0])
      }

      this.withoutHiddenClass = !hasClass(document.body, 'sd-popup-parent--hidden')

      if (this.withoutHiddenClass) {
        this.bodyPaddingRight = document.body.style.paddingRight
        this.computedBodyPaddingRight = parseInt(getStyle(document.body, 'paddingRight'), 10)
      }

      scrollBarWidth = getScrollBarWidth()

      let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
      let bodyOverflowY = getStyle(document.body, 'overflowY')
      if (
        scrollBarWidth > 0 &&
        (bodyHasOverflow || bodyOverflowY === 'scroll') &&
        this.withoutHiddenClass
      ) {
        document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
      }
      addClass(document.body, 'sd-popup-parent--hidden')
    },

    hide() {
      if (this.dropdown.modal && this.withoutHiddenClass) {
        document.body.style.paddingRight = this.bodyPaddingRight
        removeClass(document.body, 'sd-popup-parent--hidden')
      }
      this.withoutHiddenClass = true
      if (this.dropdown.trigger === 'click') {
        PopupManager.closeModal(this.dropdown.listId)
      }
    }
  }
}
</script>
<style lang="scss">
@import '../../scss/dropdown';
</style>

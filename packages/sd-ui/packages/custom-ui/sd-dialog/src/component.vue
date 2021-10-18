<template>
  <transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible" class="sd-dialog__wrapper" @click.self="handleWrapperClick">
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'sd-dialog',
          { 'is-fullscreen': fullscreen, 'sd-dialog--center': center },
          customClass
        ]"
        ref="dialog"
        :style="style"
      >
        <div class="sd-dialog__header">
          <slot name="title">
            <i
              class="iconfont sd-icon-typeIcon"
              :class="[typeClass, `sd-dialog--${type}`]"
              v-if="isShowIcon"
            ></i>
            <span class="sd-dialog__title">{{ title }}</span>
          </slot>
          <i
            class="iconfont sd-dialog__close sd-icon sd-icon-close sd-icon-close1"
            v-if="showClose"
            @click="handleClose"
          ></i>
        </div>
        <div
          class="sd-dialog__body"
          :style="{
            paddingLeft: isShowIcon ? '52px' : '20px'
          }"
          v-if="rendered"
        >
          <slot></slot>
        </div>
        <div class="sd-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'packages/utils/popup'
import emitter from 'packages/utils/mixins/emitter'

export default {
  name: 'sdDialog',
  mixins: [Popup, emitter],
  props: {
    title: {
      type: String,
      default: ''
    },

    isShowIcon: {
      type: Boolean,
      default: true
    },

    // notice 状态  默认-default  成功-success  警告- warning  错误-error
    type: {
      type: String,
      default: 'default'
    },

    // 是否需要遮罩层
    modal: {
      type: Boolean,
      default: true
    },
    // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
    appendToBody: {
      type: Boolean,
      default: false
    },
    // lock-scroll
    lockScroll: {
      type: Boolean,
      default: true
    },

    // 是否可以通过点击 modal 关闭 Dialog
    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    // 是否可以通过按下 ESC 关闭 Dialog
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    // Dialog 的自定义类名
    customClass: {
      type: String,
      default: ''
    },

    // Dialog CSS 中的 margin-top 值
    top: {
      type: String,
      default: '15vh'
    },

    // 关闭前的回调，会暂停 Dialog 的关闭
    beforeClose: Function,

    // 是否对头部和底部采用居中布局
    center: {
      type: Boolean,
      default: false
    },
    // 关闭时销毁 Dialog 中的元素
    destroyOnClose: Boolean
  },

  data() {
    return {
      closed: false,
      key: 0
    }
  },

  computed: {
    style() {
      let style = {}
      if (!this.fullscreen) {
        style.marginTop = this.top
        if (this.width) {
          style.width = this.width
        }
      }
      return style
    },

    typeClass() {
      // let className = ''

      //  notice 状态  默认-default  成功-success  警告- warning  错误-error
      let map = {
        default: 'sd-icon-warn-filled',
        success: 'sd-icon-success-filled',
        warning: 'sd-icon-warn-filled',
        error: 'sd-icon-error-filled1'
      }

      return map[this.type]
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        if (!this.closed) this.$emit('close')
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++
          })
        }
      }
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },

  methods: {
    handleWrapperClick() {
      if (!this.closeOnClickModal) return
      this.handleClose()
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/dialog';
</style>

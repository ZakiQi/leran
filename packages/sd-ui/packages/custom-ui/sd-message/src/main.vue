<template>
  <transition name="sd-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'sd-message',
        type && !iconClass ? `sd-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <i class="iconfont" :class="iconClass" v-if="iconClass"></i>
      <i class="iconfont" :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="sd-message__content">{{ message }}</p>
        <p v-else v-html="message" class="sd-message__content"></p>
      </slot>
      <i v-if="showClose" :class="type" class="sd-message__closeBtn sd-icon-close iconfont sd-icon-close1" @click="close"></i>
    </div>
  </transition>
</template>
<script>
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}
export default {
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: true,
      closed: false,
      verticalOffset: 64,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false
    }
  },
  computed: {
    typeClass() {
      const typeClassMap = {
        success: 'success-filled',
        info: 'warn-filled',
        warning: 'warn-filled',
        error: 'error-filled1'
      }
      return this.type && !this.iconClass ? `sd-message__icon sd-icon-${typeClassMap[this.type]}` : ''
    },
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`
      }
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
      }
    }
  },
  methods: {
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    close() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    },

    clearTimer() {
      clearTimeout(this.timer)
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keydown(e) {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close()
        }
      }
    }
  },
  mounted() {
    this.startTimer()
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown)
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/message.scss'
</style>
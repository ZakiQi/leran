<template>
  <div
    class="sd-tooltip-wrapper"
    style="display:inline-block"
    @mouseenter="handleShowPopper"
    @mouseleave="handleClosePopper"
  >
    <div style="display:inline-block" ref="reference">
      <slot></slot>
    </div>
    <transition name="fade">
      <div :class="warpPlace" ref="popper" v-show="!disabled && (visible || always)">
        <div class="sd-tooltip-content">
          <div class="sd-tooltip__arrow"></div>
          <div class="sd-tooltip__inner">
            <slot name="content">{{ content }}</slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Popper from '../../sd-dropdown/vue-popper'
const placements = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'left',
  'leftTop',
  'leftBottom',
  'right',
  'rightTop',
  'rightBottom'
]

export default {
  name: 'sdTooltip',
  mixins: [Popper],
  props: {
    placement: {
      validator(value) {
        return placements.includes(value)
      },
      default: 'top'
    },
    content: {
      type: [String, Number],
      default: ''
    },
    delay: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },

    // 手动控制模式，设置为 true 后，mouseenter 和 mouseleave 事件将不会生效	Boolean	—	false
    manual: Boolean,

    enterable: {
      type: Boolean,
      default: true
    },

    controlled: {
      // under this prop,Tooltip will not close when mouseleave
      type: Boolean,
      default: false
    },
    initVisible: {
      type: Boolean,
      default: false
    },
    always: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    warpPlace() {
      return ['sd-tooltip', `sd-tooltip--placement-${this.placement}`]
    }
  },
  data() {
    return {
      prefixCls: 'sd-tooltip',
      visible: false
    }
  },
  methods: {
    handleShowPopper() {
      this.timeout = setTimeout(() => {
        this.visible = true
      }, this.delay)
    },
    handleClosePopper() {
      clearTimeout(this.timeout)
      if (!this.controlled) {
        this.visible = false
      }
    },
    mounted() {
      this.visible = this.initVisible
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/tooltip';
</style>

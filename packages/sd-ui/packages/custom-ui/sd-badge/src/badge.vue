<template>
  <div class="sd-badge">
    <!-- 默认插槽 -->
    <slot></slot>
    <!-- 过度效果 -->
    <transition name="sd-zoom-in-center">
      <!-- 原生sup标签 -->
      <sup
        :style="{ top: offsetTop + 'px' }"
        v-show="!hidden && (content || content === 0 || isDot)"
        v-text="content"
        class="sd-badge__content"
        :class="[
          'sd-badge__content--' + type,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot,
            'is-icon': isIcon
          }
        ]"
      >
      </sup>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'sdBadge',

  props: {
    // 显示值 string 为自定义显示内容
    value: [String, Number],
    // 最大值，超过最大值会显示‘{max}+’，要求 value 是 Number 类型
    max: Number,
    // 小圆点
    isDot: Boolean,
    // 是否在图标上显示
    isIcon: Boolean,
    // 隐藏 badge
    hidden: Boolean,
    // 偏移量
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetRight: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'primary',
      validator(val) {
        return ['primary', 'success', 'warning', 'error'].indexOf(val) > -1
      }
    }
  },

  computed: {
    content() {
      if (this.isDot) return

      const value = this.value
      const max = this.max

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value
      }

      return value
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/badge';
</style>
 
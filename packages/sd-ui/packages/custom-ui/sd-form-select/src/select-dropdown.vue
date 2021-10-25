<template>
  <div
    class="sd-select-dropdown sd-popper"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
    :style="{ minWidth: minWidth }"
  >
    <slot></slot>
  </div>
</template>

<script>
import Popper from '../../sd-dropdown/vue-popper'
export default {
  name: 'sdSelectDropdown',

  componentName: 'sdSelectDropdown',
  mixins: [Popper],
  props: {
    placement: {
      default: 'bottom-start'
    },
    boundariesPadding: {
      default: 0
    },
    popperOptions: {
      default() {
        return {
          gpuAcceleration: false
        }
      }
    },
    visibleArrow: {
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      minWidth: ''
    }
  },
  computed: {
    popperClass() {
      return this.$parent.popperClass
    }
  },
  watch: {
    '$parent.inputWidth'() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px'
    }
  },

  mounted() {
    // 参考 - 鸡 input
    this.referenceElm = this.$parent.$refs.reference.$el

    // 弹出窗
    this.$parent.popperElm = this.popperElm = this.$el

    console.log('this.referenceElm', this.referenceElm)
    console.log('this.$parent.popperElm', this.$parent.popperElm)

    this.$on('updatePopper', () => {
      console.log('asd', this.$parent.visible)
      if (this.$parent.visible) this.updatePopper()
    })
    this.$on('destroyPopper', this.destroyPopper)
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/select.scss';
</style>

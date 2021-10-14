<template>
  <div
    class="sd-tab-pane"
    v-if="!lazy || loaded || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'sdTabPane',
  componentName: 'sdTabPane',
  props: {
    // 选项卡标题
    label: String,
    labelContent: Function,
    // 与选项卡绑定值 value 对应的标识符，表示选项卡别名
    name: String,
    // 标签是否可关闭
    closable: Boolean,
    // 是否禁用
    disabled: Boolean,
    // 标签是否延迟渲染
    lazy: Boolean
  },

  data() {
    return {
      index: null,
      loaded: false
    }
  },

  computed: {
    isClosable() {
      return this.closable || this.$parent.closable
    },
    active() {
      const active = this.$parent.currentName === (this.name || this.index)
      if (active) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.loaded = true
      }
      return active
    },
    paneName() {
      return this.name || this.index
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/tabs';
</style>

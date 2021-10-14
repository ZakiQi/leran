<template>
  <li
    class="sd-dropdown-menu__item"
    :class="{
      'is-disabled': disabled,
      'sd-dropdown-menu__item--divided': divided
    }"
    @click="handleClick"
    :aria-disabled="disabled"
    :tabindex="disabled ? null : -1"
  >
    <i class="iconfont" :class="icon" v-if="icon"></i>
    <slot></slot>
  </li>
</template>
<script>
import Emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'sdDropdownItem',

  mixins: [Emitter],

  props: {
    command: {},
    disabled: Boolean,
    divided: Boolean,
    icon: String
  },

  methods: {
    handleClick(e) {
      this.dispatch('sdDropdown', 'menu-item-click', [this.command, this])
    }
  }
}
</script>
<style lang="scss">
@import '../../scss/dropdown';
</style>

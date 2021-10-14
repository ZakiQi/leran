<template>
  <button
    class="sd-button"
    :disabled="buttonDisabled"
    :type="nativeType"
    @click="handleClick"
    :class="[
      type ? 'sd-button--' + type : '',
      buttonSize ? 'sd-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading
      }
    ]"
  >
    <i :class="icon" v-if="icon"></i>
    <i class="el-icon-loading" v-if="loading"></i>
    <span><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'sd-button',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    icon: {
      type: String,
      default: ''
    },
    size: String,
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },

  data () {
    return {
    }
  },

  computed: {
    buttonDisabled() {
      return this.disabled
    },
    buttonSize() {
      return this.size
    },
  },

  methods: {
    handleClick () {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/button.scss'
</style>
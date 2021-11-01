<template>
  <div class="sd-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
import emitter from 'packages/utils/mixins/emitter'
export default {
  name: 'sdFormCheckboxGroup',

  componentName: 'sdFormCheckboxGroup',

  mixins: [emitter],

  props: {
    value: {},
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String
  },

  computed: {
    _elFormItemSize() {
      return (this.sdFormItem || {}).sdFormItemSize
    },
    checkboxGroupSize() {
      return this.size || this._elFormItemSize
    }
  },

  watch: {
    value(value) {
      this.dispatch('sdFormItem', 'sd.form.change', [value])
    }
  },

  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>

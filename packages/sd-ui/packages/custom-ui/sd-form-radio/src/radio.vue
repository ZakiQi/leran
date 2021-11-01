<template>
  <label
    class="sd-formRadio"
    :class="[
      border && radioSize ? 'sd-formRadio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span
      class="sd-formRadio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="sd-formRadio__inner"></span>
      <input
        ref="radio"
        class="sd-formRadio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      />
    </span>
    <span class="sd-formRadio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
import emitter from 'packages/utils/mixins/emitter'
export default {
  name: 'sdFormRadio',
  componentName: 'sdFormRadio',

  inject: {
    sdForm: {
      default: ''
    },

    sdFormItem: {
      default: ''
    }
  },

  mixins: [emitter],

  props: {
    value: {},
    // Radio 的 value	string / number / boolean
    label: {},
    // 是否禁用	boolean	—	false
    disabled: Boolean,
    name: String,
    // border	是否显示边框	boolean	—	false
    border: Boolean,
    // Radio 的尺寸，仅在 border 为真时有效
    size: String
  },

  computed: {
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'sdFormRadioGroup') {
          parent = parent.$parent
        } else {
          this._radioGroup = parent
          return true
        }
      }
      return false
    },
    _elFormItemSize() {
      return (this.sdFormItem || {}).sdFormItemSize
    },
    radioSize() {
      const temRadioSize = this.size || this._elFormItemSize
      return this.isGroup ? this._radioGroup.radioGroupSize || temRadioSize : temRadioSize
    },
    isDisabled() {
      return this.isGroup
        ? this._radioGroup.disabled || this.disabled || (this.sdForm || {}).disabled
        : this.disabled || (this.sdForm || {}).disabled
    },
    tabIndex() {
      return this.isDisabled || (this.isGroup && this.model !== this.label) ? -1 : 0
    },
    model: {
      get() {
        return this.isGroup ? this._radioGroup.value : this.value
      },
      set(val) {
        if (this.isGroup) {
          this.dispatch('sdFormRadioGroup', 'input', [val])
        } else {
          this.$emit('input', val)
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label)
      }
    }
  },

  data() {
    return {
      focus: false
    }
  },
  methods: {
    handleChange() {
      this.$nextTick(() => {
        this.$emit('change', this.model)
        this.isGroup && this.dispatch('sd`RadioGroup', 'handleChange', this.model)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/radio.scss';
// @import '../../scss/radio-group';
</style>

<template>
  <label
    class="sd-checkbox"
    :class="[
      border && checkboxSize ? 'sd-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
  >
    <span
      class="sd-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="sd-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="sd-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
      <input
        v-else
        class="sd-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="sd-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
import emitter from 'packages/utils/mixins/emitter'
export default {
  name: 'sdFormCheckbox',

  componentName: 'sdFormCheckbox',

  mixins: [emitter],

  inject: {
    sdForm: {
      default: ''
    },
    sdFormItem: {
      default: ''
    }
  },

  props: {
    // 绑定值	string / number / boolean	—	—
    value: {},
    // 选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效）	string / number / boolean
    label: {},
    // 设置 indeterminate 状态，只负责样式控制	boolean	—	false
    indeterminate: Boolean,
    // 是否禁用	boolean
    disabled: Boolean,
    // 当前是否勾选	boolean
    checked: Boolean,
    // 原生 name 属性
    name: String,
    // 选中时的值
    trueLabel: [String, Number],
    // 没有选中时的值
    falseLabel: [String, Number],
    id: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    // 是否显示边框
    border: Boolean,

    size: String
  },

  watch: {
    value(value) {
      this.dispatch('sdFormItem', 'sd.form.change', value)
    }
  },

  computed: {
    model: {
      get() {
        return this.isGroup ? this.store : this.value
      },
      set(val) {
        if (this.isGroup) {
          this.isLimitExceeded = false
          this._checkboxGroup.min !== undefined &&
            val.length < this._checkboxGroup.min &&
            (this.isLimitExceeded = true)

          this._checkboxGroup.max !== undefined &&
            val.length > this._checkboxGroup.max &&
            (this.isLimitExceeded = true)

          this.isLimitExceeded === false && this.dispatch('sdFormCheckboxGroup', 'input', [val])
        } else {
          this.$emit('input', val)
        }
      }
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        // 重点是这句，如果model是数组，说明组件在group中，判断lable在不在group的value中
        return this.model.indexOf(this.label) > -1
      }
      return false
    },
    // 判断是否在group中
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'sdFormCheckboxGroup') {
          parent = parent.$parent
        } else {
          this._checkboxGroup = parent
          return true
        }
      }
      return false
    },
    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value
    },
    isLimitDisabled() {
      const { max, min } = this._checkboxGroup
      return (
        (!!(max || min) && this.model.length >= max && !this.isChecked) ||
        (this.model.length <= min && this.isChecked)
      )
    },
    isDisabled() {
      return this.isGroup
        ? this._checkboxGroup.disabled ||
            this.disabled ||
            (this.sdForm || {}).disabled ||
            this.isLimitDisabled
        : this.disabled || (this.sdForm || {}).disabled
    },
    _elFormItemSize() {
      return (this.sdFormItem || {}).sdFormItemSize
    },
    checkboxSize() {
      const temCheckboxSize = this.size || this._elFormItemSize
      return this.isGroup
        ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
        : temCheckboxSize
    }
  },

  data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    }
  },
  created() {
    this.checked && this.addToStore()
  },
  mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls)
    }
  },
  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label)
      } else {
        this.model = this.trueLabel || true
      }
    },
    handleChange(ev) {
      if (this.isLimitExceeded) return
      let value

      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel
      }
      this.$emit('change', ev.target.checked, ev)
      this.$nextTick(() => {
        if (this._checkboxGroup) {
          this.dispatch('sdFormCheckboxGroup', 'change', [this._checkboxGroup.value])
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/checkbox';
</style>

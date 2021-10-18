<template>
  <div
    :class="[
      type === 'textarea' ? 'sd-textarea' : 'sd-formInput',
      inputSize ? 'sd-formInput--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'sd-formInput-group': $slots.prepend || $slots.append,
        'sd-formInput-group--append': $slots.append,
        'sd-formInput-group--prepend': $slots.prepend,
        'sd-formInput--prefix': $slots.prefix || prefixIcon,
        'sd-formInput--suffix': $slots.suffix || suffixIcon || clearable || showPassword
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="sd-formInput-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>

      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        v-bind="$attrs"
        class="sd-formInput__inner"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      />

      <!-- 前置内容 -->
      <span class="sd-formInput__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="sd-formInput__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
      </span>

      <!-- 后置内容 -->
      <span class="sd-formInput__suffix" v-if="getSuffixVisible()">
        <span class="sd-formInput__suffix-inner">
          <span v-if="isWordLimitVisible" class="sd-formInput__count">
            <span class="sd-formInput__count-inner"> {{ textLength }}/{{ upperLimit }} </span>
          </span>
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="sd-formInput__icon" v-if="suffixIcon" :class="suffixIcon"> </i>
          </template>
          <i
            v-if="showClear"
            class="iconfont sd-formInput__icon sd-icon-circle-close sd-formInput__clear sd-icon-error-filled1"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i
            v-if="showPwdVisible"
            class="sd-formInput__icon sd-icon-view sd-formInput__clear"
            @click="handlePasswordVisible"
            >F</i
          >
        </span>
        <!-- validateIcon -->
        <i class="sd-formInput__icon" v-if="validateState" :class="['sd-formInput__validateIcon']">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="sd-formInput-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>

    <textarea
      v-else
      :tabindex="tabindex"
      class="sd-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="sd-formInput__count"
      >{{ textLength }}/{{ upperLimit }}</span
    >
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import emitter from 'packages/utils/mixins/emitter'
import calcTextareaHeight from './calcTextareaHeight'
function isKorean(text) {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi
  return reg.test(text)
}
export default {
  name: 'sdFormInput',

  componentName: 'sdFormInput',

  mixins: [emitter],

  inheritAttrs: false,

  inject: {
    sdForm: {
      default: ''
    },
    sdFormItem: {
      default: ''
    }
  },

  data() {
    return {
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isComposing: false,
      passwordVisible: false
    }
  },

  props: {
    value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator() {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            "[Element Warn][Input]'auto-complete' property will be deprecated in next major version. please use 'autocomplete' instead."
          )
        return true
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },

  computed: {
    _elFormItemSize() {
      return (this.sdFormItem || {}).sdFormItemSize
    },
    validateState() {
      return this.sdFormItem ? this.sdFormItem.validateState : ''
    },
    textareaStyle() {
      return { ...this.textareaCalcStyle, ...{ resize: this.resize } }
    },
    needStatusIcon() {
      return this.sdForm ? this.sdForm.statusIcon : false
    },
    inputSize() {
      console.log('fffff', this._elFormItemSize)
      return this.size || this._elFormItemSize || (this.$JYELEMENT || {}).size
    },
    inputDisabled() {
      return this.disabled || (this.sdForm || {}).disabled
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    showClear() {
      return (
        this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
      )
    },
    showPwdVisible() {
      return (
        this.showPassword &&
        !this.inputDisabled &&
        !this.readonly &&
        (!!this.nativeInputValue || this.focused)
      )
    },
    isWordLimitVisible() {
      // this.$attrs.maxlength &&
      return (
        this.showWordLimit &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.inputDisabled &&
        !this.readonly &&
        !this.showPassword
      )
    },
    // 限制长度
    upperLimit() {
      return this.$attrs.maxlength
    },
    // 输入框输入的字符长度
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length
      }

      return (this.value || '').length
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible && this.textLength > this.upperLimit
    }
  },

  watch: {
    value(val) {
      this.$nextTick(this.resizeTextarea)
      if (this.validateEvent) {
        this.dispatch('sdFormItem', 'sd.form.change', [val])
      }
    },
    nativeInputValue() {
      this.setNativeInputValue()
    },
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue()
        this.resizeTextarea()
        // this.updateIconOffset()
      })
    }
  },

  mounted() {
    this.setNativeInputValue()
    this.resizeTextarea()
    // this.updateIconOffset()
  },

  updated() {
    // this.$nextTick(this.updateIconOffset)
  },

  methods: {
    focus() {
      this.getInput().focus()
    },
    blur() {
      this.getInput().blur()
    },
    // 失去焦点
    handleBlur(event) {
      // this.focused = false
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('sdFormItem', 'sd.form.blur', [this.value])
      }
    },
    resizeTextarea() {
      if (this.$isServer) return
      const { autosize, type } = this
      if (type !== 'textarea') return
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        }
        return
      }
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },

    // 设置value 值
    setNativeInputValue() {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    // 激活焦点
    handleFocus(event) {
      this.focused = true
      this.$emit('focus', event)
    },

    handleCompositionStart() {
      // this.isComposing = true
    },

    handleCompositionUpdate() {
      const text = event.target.value
      const lastCharacter = text[text.length - 1] || ''
      console.log('lastCharacter', lastCharacter)
      // this.isComposing = !isKorean(lastCharacter)
    },

    handleCompositionEnd(event) {
      this.handleInput(event)

      // if (this.isComposing) {
      //   this.isComposing = false
      //   this.handleInput(event)
      // }
    },

    // 监听输入
    handleInput(event) {
      console.log('asdasdasd')

      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) return
      this.$emit('input', event.target.value)

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue)
    },

    // 值改变的时候
    handleChange(event) {
      this.$emit('change', event.target.value)
    },

    // 清除
    clear() {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
    },

    handlePasswordVisible() {
      this.passwordVisible = !this.passwordVisible
      this.$nextTick(() => {
        this.focus()
      })
    },

    // 获取节点元素
    getInput() {
      return this.$refs.input || this.$refs.textarea
    },

    getSuffixVisible() {
      return (
        this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        this.showPassword ||
        this.isWordLimitVisible ||
        (this.validateState && this.needStatusIcon)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/formInput';
</style>

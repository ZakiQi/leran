<template>
  <div
    class="sd-form-item"
    :class="[
      {
        'sd-form-item--feedback': sdForm && sdForm.statusIcon,
        'is-error': validateState === 'error',
        'is-validating': validateState === 'validating',
        'is-success': validateState === 'success',
        'is-required': isRequired || required,
        'is-no-asterisk': sdForm && sdForm.hideRequiredAsterisk
      },
      sizeClass ? 'sd-form-item--' + sizeClass : ''
    ]"
  >
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="form.labelWidth === 'auto'"
    >
      <label
        :for="labelFor"
        class="sd-form-item__label"
        :style="labelStyle"
        v-if="label || $slots.label"
      >
        <slot name="label">{{ label + form.labelSuffix }}</slot>
      </label>
    </label-wrap>
    <div class="sd-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="sd-zoom-in-top">
        <slot
          v-if="validateState === 'error' && showMessage && form.showMessage"
          name="error"
          :error="validateMessage"
        >
          <div
            class="sd-form-item__error"
            style="display: flex;align-items: center;"
            :class="{
              'sd-form-item__error--inline':
                typeof inlineMessage === 'boolean'
                  ? inlineMessage
                  : (sdForm && sdForm.inlineMessage) || false
            }"
          >
            <!-- <i
              class="iconfont sd-icon-error-filled1"
              style="margin-right: 4px;width: 16px;height: 16px;"
            ></i> -->
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>

<script>
import LabelWrap from './label-wrap'
import emitter from 'packages/utils/mixins/emitter'
import AsyncValidator from 'async-validator'

export function getPropByPath(obj, path, strict) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  let keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    let key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!')
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  }
}

export function noop() {}

export default {
  name: 'sdFormItem',
  componentName: 'sdFormItem',

  mixins: [emitter],

  provide() {
    return {
      sdFormItem: this
    }
  },

  inject: ['sdForm'],

  components: {
    // use this component to calculate auto width
    LabelWrap
  },

  props: {
    // 标签文本
    label: String,

    // 表单域标签的的宽度，例如 '50px'。支持 auto。
    labelWidth: String,

    // 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	string	传入 Form 组件的 model 中的字段
    prop: String,

    // 需要校验的
    required: {
      type: Boolean,
      default: undefined
    },
    // item 的规则
    rules: [Object, Array],

    // 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
    error: String,

    // show-message

    validateStatus: String,
    for: String,

    // 行内信息提示功能
    inlineMessage: {
      type: [String, Boolean],
      default: ''
    },

    // 是否显示校验错误信息
    showMessage: {
      type: Boolean,
      default: true
    },

    size: String
  },

  computed: {
    // 不懂什么意思
    labelFor() {
      return this.for || this.prop
    },

    labelStyle() {
      const ret = {}
      if (this.form.labelPosition === 'top') return ret
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth) {
        ret.width = labelWidth
      }
      return ret
    },

    contentStyle() {
      const ret = {}
      const label = this.label
      if (this.form.labelPosition === 'top' || this.form.inline) return ret
      if (!label && !this.labelWidth && this.isNested) return ret
      const labelWidth = this.labelWidth || this.form.labelWidth
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth
        } else if (this.form.labelWidth === 'auto') {
          ret.marginLeft = this.sdForm.autoLabelWidth
        }
      } else {
        ret.marginLeft = labelWidth
      }
      return ret
    },

    form() {
      let parent = this.$parent
      let parentName = parent.$options.componentName
      while (parentName !== 'sdForm') {
        if (parentName === 'sdFormItem') {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.isNested = true
        }
        parent = parent.$parent
        parentName = parent.$options.componentName
      }
      return parent
    },

    fieldValue() {
      const model = this.form.model
      if (!model || !this.prop) {
        return
      }

      let path = this.prop

      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }
      return getPropByPath(model, path, true).v
    },

    isRequired() {
      let rules = this.getRules()

      let isRequired = false

      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }
      return isRequired
    },

    _formSize() {
      return this.sdForm.size
    },
    sdFormItemSize() {
      return this.size || this._formSize
    },
    sizeClass() {
      return this.sdFormItemSize
    }
  },

  data() {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      isNested: false,
      computedLabelWidth: ''
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false
      const rules = this.getFilteredRule(trigger)
      console.log('1111', rules)

      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback()
        return true
      }

      this.validateState = 'validating'

      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          delete rule.trigger
        })
      }

      descriptor[this.prop] = rules

      const validator = new AsyncValidator(descriptor)
      const model = {}
      model[this.prop] = this.fieldValue

      // https://zhuanlan.zhihu.com/p/269624748
      /**
       *
          source: 需要校验的对象（必选）。
          options: 描述校验的处理选项的对象（可选）。
          callback: 当校验完成时调用的回调函数（必选）
       */
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''
        console.log('errors', errors)
        callback(this.validateMessage, invalidFields)
        this.sdForm &&
          this.sdForm.$emit('validate', this.prop, !errors, this.validateMessage || null)
      })
    },
    clearValidate() {
      this.validateState = ''
      this.validateMessage = ''
      this.validateDisabled = false
    },

    resetField() {
      this.validateState = ''
      this.validateMessage = ''

      let model = this.form.model
      let value = this.fieldValue
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      let prop = getPropByPath(model, path, true)

      this.validateDisabled = true
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        prop.o[prop.k] = this.initialValue
      }

      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false
      })

      this.broadcast('sdTimeSelect', 'fieldReset', this.initialValue)
    },
    getRules() {
      // 整个表单的
      let formRules = this.form.rules

      //  item 项的
      const selfRules = this.rules
      const requiredRule = this.required !== undefined ? { required: !!this.required } : []

      const prop = getPropByPath(formRules, this.prop || '')
      formRules = formRules ? prop.o[this.prop || ''] || prop.v : []

      return [].concat(selfRules || formRules || []).concat(requiredRule)
    },

    getFilteredRule(trigger) {
      const rules = this.getRules()

      return rules
        .filter((rule) => {
          if (!rule.trigger || trigger === '') return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1
          } else {
            return rule.trigger === trigger
          }
        })
        .map((rule) => Object.assign({}, rule))
    },

    onFieldBlur() {
      this.validate('blur')
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }

      this.validate('change')
    },

    addValidateEvents() {
      const rules = this.getRules()

      if (rules.length || this.required !== undefined) {
        this.$on('sd.form.blur', this.onFieldBlur)
        this.$on('sd.form.change', this.onFieldChange)
      }
    },
    removeValidateEvents() {
      this.$off()
    }
  },
  mounted() {
    if (this.prop) {
      this.dispatch('sdForm', 'sd.form.addField', [this])

      let initialValue = this.fieldValue

      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue)
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      })

      this.addValidateEvents()
    }
  },
  beforeDestroy() {
    this.dispatch('sdForm', 'sd.form.removeField', [this])
  }
}
</script>

<template>
  <form
    class="sd-form"
    :class="[labelPosition ? 'sd-form--label-' + labelPosition : '', { 'sd-form--inline': inline }]"
  >
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'sdForm',
  componentName: 'sdForm',

  provide() {
    return {
      sdForm: this
    }
  },

  props: {
    // 表单数据对象
    model: Object,

    // 表单验证规则
    rules: Object,

    // 行内表单模式
    inline: Boolean,

    // 行内信息提示功能
    inlineMessage: String,

    // 是否在输入框中显示校验结果反馈图标	boolean	—	false
    statusIcon: Boolean,

    // 是否显示校验错误信息
    showMessage: {
      type: Boolean,
      default: true
    },

    // 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width   right/left/top
    labelPosition: String,

    // 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto
    labelWidth: String,

    size: String,

    // 表单域标签的后缀
    labelSuffix: {
      type: String,
      default: ''
    },
    // 是否在 rules 属性改变后立即触发一次验证	boolean	—	true
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    // 是否隐藏必填字段的标签旁边的红色星号	boolean	—	false
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    // 表单规则更改后，在表单-item上删除并添加事件监听器
    rules() {
      this.fields.forEach((field) => {
        field.removeValidateEvents()
        field.addValidateEvents()
      })

      if (this.validateOnRuleChange) {
        this.validate(() => {})
      }
    }
  },

  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) {
        return 0
      }
      const max = Math.max(...this.potentialLabelWidthArr)
      return max ? `${max}px` : ''
    }
  },
  data() {
    return {
      fields: [],
      // 使用这个数组来计算自动宽度
      potentialLabelWidthArr: []
    }
  },

  created() {
    // 从 form-item 来
    this.$on('sd.form.addField', (field) => {
      if (field) {
        this.fields.push(field)
      }
    })

    this.$on('sd.form.removeField', (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  },

  methods: {
    // 重置表单：就是让里面每个item各自重置自己即可
    resetFields() {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for resetFields to work.')
        return
      }

      this.fields.forEach((field) => {
        field.resetField()
      })
    },

    // 清空校验：支持清空针对某个prop的校验，可以是字符串，也可以是数组。如果什么都不传的话，就去情况整个表单的校验了
    clearValidate(props = []) {
      const fields = props.length
        ? typeof props === 'string'
          ? this.fields.filter((field) => props === field.prop)
          : this.fields.filter((field) => props.indexOf(field.prop) > -1)
        : this.fields

      fields.forEach((field) => {
        field.clearValidate()
      })
    },
    // 单独校验某个item，根据传入的prop过滤出对应的field，如果有多个只取第一个，然后校验，执行回调
    validateField(props, cb) {
      props = [].concat(props)
      const fields = this.fields.filter((field) => props.indexOf(field.prop) !== -1)
      if (!fields.length) {
        console.warn('[Element Warn]please pass correct props!')
        return
      }

      fields.forEach((field) => {
        field.validate('', cb)
      })
    },

    // 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
    validate(callback) {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for validate to work!')
        return
      }

      let promise = null
      // 如果没有回调，返回promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function(valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      let valid = true
      let count = 0

      if (this.fields.length === 0 && callback) {
        callback(true)
      }

      let invalidFields = {}
      this.fields.forEach((field) => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          // invalidFields = objectAssign({}, invalidFields, field)
          invalidFields = Object.assign({}, invalidFields, field)
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/form';
</style>

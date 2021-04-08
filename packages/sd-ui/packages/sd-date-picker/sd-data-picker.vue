<template>
    <el-date-picker :value.sync="value" v-bind="$attrs" v-on="$listeners"></el-date-picker>
</template>

<script>
export default {
  name: 'sdDatePicker',

  props: {
    value: {}
  },

  data () {
    return  {
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner{
  background-color: $background-assist;
  border: 1px solid $secondary-background !important;
}

// 焦点时候外框颜色
/deep/ .el-input__inner:focus {
  border: 1px solid $color-primary;
}
</style>

<style lang="scss">
.el-month-table td.in-range div, .el-date-table td.in-range div, .el-month-table td.in-range div:hover{
  background-color: $color-orther !important;
}
.el-month-table td .cell:hover{
  color: $color-primary !important;
}
.el-date-table td.available:hover{
  & > div{
    background: $color-orther;
  }
}
.el-date-picker__header-label,
.el-date-table th, 
.el-picker-panel__icon-btn,
.el-picker-panel, 
.el-month-table td .cell,
.gray .el-date-editor .el-range-input{
  color: $primary-text !important;
}
.el-picker-panel, .el-input__inner, .el-range-input{
  background: $background-assist !important;
  border: 1px solid $secondary-background !important;
}
</style>
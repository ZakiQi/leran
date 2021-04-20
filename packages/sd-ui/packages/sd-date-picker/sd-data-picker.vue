<template>
  <el-date-picker :value.sync="value" v-bind="$attrs" v-on="$listeners" clear-icon="el-icon-share"></el-date-picker>
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
  padding-left: 10px !important;
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

.el-input--prefix .el-input__inner{
  padding-left: 10px !important;
  font-size: $primary-text-size !important;
  color: $primary-text !important;

  height: 26px !important;
  line-height: 26px !important;
}


.el-range-input, .el-date-range-picker__header div, .el-month-table, .el-year-table, .el-date-table{
  font-size: $primary-text-size !important;
  font-family:  PingFangSC-Medium, PingFang SC !important;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 22px;
  text-shadow: 0px 12px 48px rgba(0, 0, 0, 0.03);
}
.el-date-range-picker__header div{
  font-family:  PingFangSC-Medium, PingFang SC;
}
.el-range-separator, .el-range-input{
  color: #FFFFFF !important;
}
.el-date-editor .el-range__icon{
  display: none !important;
}
.el-picker-panel{
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03), 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.19), 0px 3px 6px -4px rgba(0, 0, 0, 0.4) !important;
}
.el-date-range-picker__content.is-left{
  border-right: 1px solid rgba(255,255,255, 0.2) !important;
}
.el-date-table th, .el-date-picker__header--bordered{
  border-bottom: 1px solid rgba(255,255,255, 0.2) !important;
}

.el-date-editor ::-webkit-input-placeholder {
  color: rgba(255,255,255, 0.4) !important;
}

.el-month-table td.current:not(.disabled) .cell{
  color: #409eff !important;
}

.el-date-editor .el-range-input, .el-date-editor .el-range-separator{
  text-align: left !important;
}

// 下拉内容样式
.el-month-table td .cell{
  width: 71px !important;
}
.el-month-table td div{
  height: 36px !important;
  padding: 0 !important;
}
.el-input__prefix{
  display: none;
}

.el-date-table td.next-month, .el-date-table td.prev-month{
  color: rgba(255, 255, 255, 0.25) !important;
  text-shadow: 0px 12px 48px rgba(0, 0, 0, 3%) !important;
  font-weight: 400;
  font-family: PingFangSC-Regular, PingFang SC;
}

// 更改时间选择器默认清空icon
.el-input__suffix-inner .el-icon-circle-close::before{
  color: rgba(255, 255, 255, 0.4) !important;
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: '\e605' !important;
}

// .el-input__suffix-inner .el-icon-circle-close::after{
//   color: red !important;
// }

// .el-input__suffix-inner .el-icon-circle-close{
//   color: red !important;
// }
</style>
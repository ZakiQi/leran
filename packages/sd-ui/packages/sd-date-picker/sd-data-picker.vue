<!-- 时间选择器组件 -->
<template>
  <el-date-picker :value.sync="value" v-bind="$attrs" v-on="$listeners" @blur="pickerBlur" @focus="pickerFocus"></el-date-picker>
</template>

<script>

import mask from '../mixins/mask-mixins'

export default {
  name: 'sdDatePicker',

  mixins: [mask],

  props: {
    value: {}
  },

  data () {
    return  {
      top: 0,
      wrapHg: 0
    }
  },

  methods: {
    // 下拉内容出现要阻止滚动，思路是创建一个body下的mask，下拉的时候吧display设置为block，收回的时候设置为none
    // 为了避免每个时间选择器都产生一个新dom，会使用第一次创建的dom，重复利用
    pickerFocus (e) {
      this.maskWrap(true)
      // let maskDom = document.getElementById('sd-picker-mask')
      // if (maskDom) {
      //   maskDom.style.display = 'block'
      // } else {
      //   let _div = document.createElement('div')
      //   _div.id = 'sd-picker-mask'
      //   _div.className = 'pick-mask'
      //   document.body.appendChild(_div);
      // }
      // this.show = true
    },

    // // 弹窗消失的时候
    pickerBlur (e) {
      this.maskWrap(false)
      // this.show = false
      // let maskDom = document.getElementById('sd-picker-mask')
      // if (maskDom) {
      //   maskDom.style.display = 'none'
      // }
    }
  },

  created () {
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner{
  background-color: $background-assist;
  border: 1px solid $secondary-background !important;
  padding-left: 10px !important;
  border-radius: 2px;
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
.el-year-table td .cell,
.gray .el-date-editor .el-range-input{
  color: $primary-text !important;
}
.el-date-table th{
  color: $primary-text-opacity-2 !important;
  font-family: PingFangSC-Regular, PingFang SC !important;
  line-height: 20px;
}
.el-picker-panel, .el-input__inner, .el-range-input{
  background: $background-assist !important;
  border: 1px solid $secondary-background !important;
}

.el-input--prefix .el-input__inner{
  padding-left: 10px !important;
  font-size: $primary-text-12 !important;
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
  border-bottom: none !important;
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
  color: rgba(255, 255, 255, 0.2) !important;
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
.pick-mask{
  position: fixed;
  z-index: 9;
  height: 100%;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
  left: 0;
  display: block;
}
</style>
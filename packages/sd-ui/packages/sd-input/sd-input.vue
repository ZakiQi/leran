/*
 * @Author: YQ 
 * @Description: sj-input组件
 */

<template>
  <el-input :value.sync="value" v-bind="$attrs" v-on="$listeners" class="sd-input"></el-input>
</template>

<script>
export default {
  name: 'sdInput',

  props: {
    value: {}
  },

  watch: {
  }
}
</script>

<style lang="scss" scoped>
.sd-input{
  border: none;

  /deep/ input{
    background: $background-assist;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/ .el-input__inner{
    border: 1px solid $secondary-background !important;
    font-size: $primary-text-size;
    font-weight: 500;
  }

  // 焦点时候外框颜色
  /deep/ .el-input__inner:focus {
    border: 1px solid $color-primary;
  }
}

// ::-webkit-input-placeholder{
//   // color: rgba(255,255,255, 0.4) !important;
//   color: red !important;
// }
</style>

<style lang="scss">
::-webkit-input-placeholder{
  color: rgba(255,255,255, 0.4) !important;
  font-family:  PingFangSC-Medium, PingFang SC !important;
  font-weight: 500;
}
</style>

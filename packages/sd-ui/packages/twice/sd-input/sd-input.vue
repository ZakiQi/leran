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
    @include setAttr('background', 'input-bg');
    @include setAttr('color', 'text-color');

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/ .el-input__inner{
    padding: 0 12px;
    @include themeify {
      border: 1px solid themed('base-border') !important;
    }
    
    font-size: $font-size-14;
    font-weight: 500;
  }

  // 焦点时候外框颜色
  /deep/ .el-input__inner:focus {
    border: 1px solid $color-primary;
  }
}

</style>

<style lang="scss">
::-webkit-input-placeholder{
  @include themeify {
    color: themed('input-placeholder') !important;
  }
  font-family:  PingFangSC-Medium, PingFang SC !important;
  font-weight: 500;
}
</style>

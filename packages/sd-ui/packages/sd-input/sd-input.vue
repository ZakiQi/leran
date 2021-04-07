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

<style lang="scss">
.sd-input{
  border: none;

  /deep/ input{
    background: #414F6F;
    color: #fff;
  }

  // 焦点时候外框颜色
  /deep/ .el-input__inner:focus {
    border: 1px solid #409EFF;
  }
}
</style>

/*
 * @Author: YQ 
 * @Date: 2021-3-31
 * @Last Modified time: 2021-3-31 15:15:00 
 * @Description: sj-button组件,带显示title
 */
<template>
  <el-select class="sd-select" :value.sync="value" placeholder="请选择"  v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'sdSelect',

  props: {
    value: {},
    options: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  /deep/ input{
    @include setAttr('background', 'input-bg');
    @include setAttr('color', 'text-color');
  }

  // 焦点时候外框颜色
  /deep/ .el-input__inner {
    @include themeify {
      border: 1px solid themed('base-border') !important;
    }
    font-size: 12px;
  }
}
// /deep/ .el-select-dropdown{
//   background: red;
// }
</style>

<style lang="scss">
.el-select-dropdown{
  @include themeify {
    background: themed('input-bg') !important;
  }
}

.el-select-dropdown{
  // border: 1px solid $color-primary !important;
  border: none !important;
}

.el-select-dropdown__list .selected{
  @include themeify {
    background: themed('select-active') !important;
  }
}

.el-select-dropdown__list .hover{
  @include themeify {
    background: themed('select-hover') !important;
  }
}

.el-select-dropdown__item{
  @include themeify {
    color: themed('text-color') !important;
  }

  font-size: 12px !important;
  font-weight: 100;
}

// 三角
.el-popper[x-placement^=bottom] .popper__arrow::after{
  @include themeify {
    border-bottom-color: themed('select-triangle') !important;
    border-style: themed('border-style');
  }

}

.el-popper[x-placement^=bottom] .popper__arrow{
  @include themeify {
    border-bottom-color: themed('select-triangle') !important;
  }
}
</style>
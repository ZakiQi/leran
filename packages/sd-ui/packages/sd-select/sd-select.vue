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
    background: $background-assist;
    color: #fff;
  }

  // 焦点时候外框颜色
  /deep/ .el-input__inner {
    border: 1px solid $secondary-background !important;
    font-size: 12px;
  }
}
/deep/ .el-select-dropdown{
  background: red;
}
</style>

<style lang="scss">
.el-select-dropdown{
  background: $color-orther !important;
}

.el-select-dropdown{
  // border: 1px solid $color-primary !important;;
  border: none !important;
}

.el-select-dropdown__list .selected{
  background: $background-assist !important;
}

.el-select-dropdown__list .hover{
  background: $background-assist !important;
}

.el-select-dropdown__item{
  color: $primary-text !important;
  font-size: 12px !important;
  font-weight: 100;
}

// 三角
.el-popper[x-placement^=bottom] .popper__arrow::after{
  border-bottom-color: $secondary-background !important;
}

.el-popper[x-placement^=bottom] .popper__arrow{
  border-bottom-color: $secondary-background !important;
}
</style>
<template>
  <div class="demo" style="height: 100%; width: 100%; border: 1px solid green; overflow: auto;">
    <el-button @click="themeChange">切换</el-button>

    <!-- <sd-button :type="'primary'" :title="'文字'" size="small">
      文字
    </sd-button> -->


    <sd-input v-model="inputValue" style=" width: 100px;margin: 10px;" size="mini" placeholder="请输入内容"></sd-input>

    <sd-select v-model="selectValue" size="mini" :options="selectOptions"></sd-select>

    <!-- <el-button size="mini" @click="sideDialogVisible = !sideDialogVisible">分享</el-button>

    <sd-date-picker
      v-model="endMonth"
      type="month"
      size="mini"
      value-format="yyyy-MM"
      :editable="false"
      style="width: 150px;margin-top: 5px;height: 26px;margin-right: 20px"
      placeholder="月份">
    </sd-date-picker>

    <sd-date-picker
      v-model="monthValue"
      type="monthrange"
      :range-separator="separator"
      size="mini"
      style="width:231px;margin-left: 10px;"
      value-format="yyyy-MM"
      start-placeholder="开始月份"
      end-placeholder="结束月份">
    </sd-date-picker>

    <sd-date-picker
      v-model ="value1"
      type="daterange"
      range-separator="-"
      size="mini"
      style="width:231px;margin-left: 10px;"
      value-format="yyyy-MM"
      start-placeholder="开始月份"
      end-placeholder="结束月份">
    </sd-date-picker>

    <sd-transfer :value.sync="val" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer>
    <sd-transfer :value.sync="val1" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      sideDialogVisible: false,
      selectValue: '',
      inputValue: '',
      selectOptions: [{
        value: '从化',
        label: '从化'
      }, {
        value: '天河',
        label: '天河'
      }, {
        value: '黄埔',
        label: '黄埔'
      }, {
        value: '海珠',
        label: '海珠'
      }, {
        value: '越秀',
        label: '越秀'
      }, {
        value: '南沙',
        label: '南沙'
      }, {
        value: '荔湾',
        label: '荔湾'
      }, {
        value: '白云',
        label: '白云'
      }, {
        value: '增城',
        label: '增城'
      }, {
        value: '东山',
        label: '东山'
      }, {
        value: '花都',
        label: '花都'
      }, {
        value: '番禺',
        label: '番禺'
      }, {
        value: '其它',
        label: '其它'
      }],
      endMonth: '',
      monthValue: '',
      value1: '',
      separator: '-',
      val: [],
      val1: [],
    }
  },

  methods: {
    themeChange () {
      this.$emit('themeChange')
    }
  }
}
</script>

<style lang="scss">
@include scrollBarStyle();
.demo{
  @include setAttr('background', 'bg-color');
}
</style>
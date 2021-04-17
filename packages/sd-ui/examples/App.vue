<template>
  <div id="app">
    <!-- <sd-button :type="'primary'" :title="'文字'" size="small">
      文字
    </sd-button> -->

    <!-- <sd-input v-model="inputValue" style=" width: 100px;margin: 10px;" size="mini" placeholder="请输入内容"></sd-input> -->

    <!-- <sd-select v-model="selectValue" size="mini" :options="selectOptions"></sd-select> -->

    <el-date-picker
      v-model="endMonth"
      type="month"
      size="mini"
      value-format="yyyy-MM"
      style="width: 134px;margin-top: 5px;height: 26px;"
      placeholder="月份">
    </el-date-picker>

    <!-- <sd-date-picker
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
      v-model="value1"
      type="daterange"
      range-separator="-"
      size="mini"
      style="width:231px;margin-left: 10px;"
      value-format="yyyy-MM"
      start-placeholder="开始月份"
      end-placeholder="结束月份">
    </sd-date-picker> -->

    <el-date-picker
      v-model="value2"
      type="date"
      size="mini"
      style="margin-left: 10px;"
      placeholder="选择日期">
    </el-date-picker>

    <sd-transfer :value.sync="val" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer>
  </div>
</template>

<script>
export default {
  name: "App",

  data () {
    return {
      val: [],
      val1: [],
      value2: '',
      separator: '-',
      inputValue: '',
      selectValue: '',
      monthValue: '',
      value1: '',
      endMonth: '',
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
      selectOptions1: [{
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
      }]
    }
  },

  watch: {
    val (val) {
    },
    selectValue (val) {
      console.log(val, 'val')
    },

    inputValue (val) {
      console.log(val)
    }
  },

  components: {
  },

  methods: {
  },

  mounted () {
    this.$theme()
    console.log(this)
  }
}
</script>

<style lang="scss">
html, body{
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: $font-family;
  input, button{
    font-family: $font-family;
  }
}
#app {
  height: 100%;
  width: 100%;
  padding: 10px;
  background: $primary-background;
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

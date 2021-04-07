<template>
  <div id="app">
    <sj-button :type="'primary'" :title="'文字'" size="small">
      文字
    </sj-button>

    <sd-input v-model="inputValue" style=" width: 100px;margin-top: 10px;" size="small" placeholder="请输入内容"></sd-input>

    <sd-select v-model="selectValue" size="small" :options="selectOptions"></sd-select>
  </div>
</template>

<script>
export default {
  name: "App",

  data () {
    return {
      inputValue: '',
      selectValue: '',
      selectOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '蚵仔煎'
      }, {
        value: '选项5',
        label: '蚵仔煎'
      }]
    }
  },

  watch: {
    selectValue (val) {
      console.log(val, 'val')
    },

    inputValue (val) {
      console.log(val)
    }
  },

  components: {
  },

  mounted () {
    this.$theme('gray')
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
  background: rgba(0,0,0,0.2);
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

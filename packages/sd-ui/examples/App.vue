<template>
  <div id="app">
    <sj-button :type="'primary'" :title="'文字'">
      文字
    </sj-button>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
  },

  mounted () {
    this.$theme()
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

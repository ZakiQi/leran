<template>
  <div id="app">
    <sj-button :type="'primary'" :title="'文字'">
      文字
    </sj-button>
  </div>
</template>

<script>

// console.log(previewUI, 'previewUI')
export default {
  name: "App",
  components: {
    // sjButton
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

<template>
  <div class="message-demo">
    <el-button @click="open1">默认按钮</el-button>
    <el-button :plain="true" @click="open2">成功</el-button>
    <el-button :plain="true" @click="open3">警告</el-button>
    <el-button :plain="true" @click="open4">错误</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$sdMessage({
        duration:0,
        message: '这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全'
      })
    },
    open2() {
      this.$sdMessage({
        type:'success',
        duration:0,
        message: '这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全'
      })
    },
    open3() {
      this.$sdMessage({
        type:'warning',
        duration:0,
        message: '这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全'
      })
    },
    open4() {
      this.$sdMessage({
        type:'error',
        duration:0,
        message: '这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全局提醒这是一条全'
      })
    }
  }
}
</script>

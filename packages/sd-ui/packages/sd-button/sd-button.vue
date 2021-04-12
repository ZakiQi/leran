/*
 * @Author: YQ 
 * @Date: 2021-3-31
 * @Last Modified time: 2021-3-31 15:15:00 
 * @Description: sj-button组件,带显示title
 */
<template>
  <div class="sj-button">
    <el-tooltip :content="title" effect="light" v-bind="$attrs" :popper-class="'sj-tootip'">
      <el-button v-bind="$attrs" v-on="$listeners">
        <slot></slot>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'sdButton',

  data () {
    return {
      hide: 0,
      aa: true
    }
  },
  
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
  }
}
</script>

<style>
.sj-tootip{
  padding: 5px 10px !important;
}
</style>
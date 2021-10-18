<template>
  <div
    style="
    text-align: left;
    padding: 20px;
    margin-top: 10px;"
  >
    <sd-button @click="dialogVisible = true">点击打开 Dialog</sd-button>
    <sd-dialog title="标题" :visible.sync="dialogVisible" width="490px">
      <span>这里是提醒弹窗的正文文案</span>
      <span slot="footer" class="dialog-footer">
        <sd-button size="medium" @click="dialogVisible = false">取 消</sd-button>
        <sd-button size="medium" type="primary" @click="dialogVisible = false">确 定</sd-button>
      </span>
    </sd-dialog>
  </div>
</template>

<script>
// import sdButton from '../../packages/custom-ui/sd-button/sd-button.vue'
export default {
  // components: { sdButton },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    open() {}
  }
}
</script>

<style lang="scss" scoped></style>

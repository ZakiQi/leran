<template>
  <div style="text-align: left; padding: 20px; margin-top: 10px;">
    <sd-badge :value="101" :max="99" class="item">
      <sd-button size="small">评论</sd-button>
    </sd-badge>
    <sd-badge :value="1" class="item" type="primary">
      <sd-button size="small">评论</sd-button>
    </sd-badge>
    <sd-badge :value="1" class="item" type="success">
      <sd-button size="small">评论</sd-button>
    </sd-badge>
    <sd-badge :value="1" class="item" type="warning">
      <sd-button size="small">评论</sd-button>
    </sd-badge>
    <sd-badge is-dot :value="1" class="item">
      <sd-button size="small">评论</sd-button>
    </sd-badge>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.item {
  margin-left: 30px;
}

.test {
  background-color: green;
  font-size: 12px;
  padding: 0 4px;
  line-height: 16px;
  border-radius: 8px;
  height: 16px;
}
</style>

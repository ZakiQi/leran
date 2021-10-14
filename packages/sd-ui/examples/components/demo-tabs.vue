<template>
  <div
    style="
    padding: 20px;"
  >
    <sd-tabs v-model="activeName">
      <template v-for="item in tabs">
        <sd-tab-pane :label="item.label" :name="item.name" :key="item.label"></sd-tab-pane>
      </template>
    </sd-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'mykanban',
      tabs: [
        { label: '我的看板', name: 'mykanban' },
        { label: '与我共享', name: 'shareMe' },
        { label: '最新相关', name: 'theLatest' },
        { label: '我的收藏', name: 'myFavorite' },
        { label: '热点关注', name: 'hot' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>

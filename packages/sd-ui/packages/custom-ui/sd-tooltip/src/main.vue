<template>
  <transition name="fade">
    <div :class="warpPlace" v-show="show">
      <div class="sd-tooltip-content">
        <div class="sd-tooltip__arrow"></div>
        <div class="sd-tooltip__inner">
          <span v-html="tip"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'sdTooltip',
  computed: {
    warpPlace() {
      return ['sd-tooltip', `sd-tooltip--placement-${this.place}`]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/tooltip';
</style>

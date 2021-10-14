/*
 * @Author: YQ 
 * @Date: 2021-9-6
 * @Last Modified time: 2021-9-6 16:18:00 
 * @Description: 侧边弹窗
 */
<template>
    <transition
      name="sd-drawer-fade"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
    >
      <div v-show="visible" class="sd-dialog__wrapper">
        <!-- 包装 -->
        <div
          class="sd-drawer__container"
          :class="visible && 'sd-drawer__open'"
          @click.self="handleWrapperClick">

          <!-- 内容 -->
          <div class="sd-drawer rtl">
            1231231
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
export default {
  name: 'sideDialog',
  props:{
    visible: {
      type: Boolean,
      default: false
    },

    direction: {
      type: String,
      default: 'right'
    },

    width: {
      type: Number,
      default: 300
    },

    title: {
      type: String,
      default: ''
    }
  },

  components: {
  },

  data () {
    return {
     
    }
  },

  computed: {
  
  },

  watch: {
    visible (val) {
      if(val) {
        this.flag = true
      }
    }
  },

  methods: {
    handleWrapperClick () {
      this.$emit('update:visible', false)
    },

    afterEnter () {
    },

    afterLeave () {
    }
  }
}
</script>

<style lang="scss">
@keyframes sd-drawer-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.sd-drawer-fade-enter-active {
  animation: sd-drawer-fade-in .3s;
}

.sd-drawer-fade-leave-active {
  animation: sd-drawer-fade-in .3s reverse;
}


.sd-dialog__wrapper{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin: 0;
  z-index: 999;
}

.sd-drawer__container{
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
}

@keyframes drawer-in{
    0% {
      transform: translate(100%, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
}

@keyframes drawer-out{
    0% {
      transform: translate(0px, 0px);
    }
    100% {
      transform: translate(100%, 0px);
    }
}


.sd-drawer{
  width: 30%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  // box-shadow: 0 8px 10px -5px rgb(0 0 0 / 20%), 0 16px 24px 2px rgb(0 0 0 / 14%), 0 6px 30px 5px rgb(0 0 0 / 12%);
  overflow: hidden;
  outline: 0;


  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
  0 16px 24px 2px rgba(0, 0, 0, 0.14),
  0 6px 30px 5px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  outline: 0;

  animation: drawer-out .3s;
}

.sd-drawer__open .sd-drawer{
  animation: drawer-in .3s 1ms;
}
</style>

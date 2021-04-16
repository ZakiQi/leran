<!-- 下拉穿梭框 -->
<template>
  <div class="sd-transfer">
    <div class="transfer-contents not-to-away" :title="inputVal" @click="PositionCalc($event)">
      <div class="transfer-mask" @click.stop="expansion($event)"></div>
      <sd-input v-model="inputVal" size="mini" :placeholder="placeholder"></sd-input>
    </div>
    
    <i class="iconfont not-to-away clearable" style="line-height:28px;" v-show="!!inputVal" @click="clearableOperate">&#xe605;</i>
    <i :class="['el-icon-arrow-down', 'not-to-away', isExpansion && 'icon-expansion']" @click="expansion($event)"></i>

    <!-- 下拉框内容 -->
    <transfer-sptions
      v-on-clickaway="away"
      :options="options"
      :show="isExpansion"
      :parent="parentEle"
      :placeholder="placeholder"
      :loading="loading"
      ref="transferSptions"
      @updateSelectInfo="updateSelectInfo"
      @cancel="cancel"
      @confirm="confirm">
    </transfer-sptions>
  </div>
</template>

<script>
import transferSptions from './transfer-sptions'
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'sdTransfer',

  mixins: [ clickaway ],

  props: {
    value: {
    },

    options: {
      type: Array,
      immediate: true
    },

    defaultOption: {
      type: Array,
      default: () => []
    },

    placeholder: {
      type: String,
      default: '请选择'
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  components: {
    transferSptions
  },

  data () {
    return {
      inputVal: '',
      searchVal: '',
      selectedArr: [],
      selectNum: 3,
      isExpansion: false,
      parentEle: {}
    }
  },

  watch: {
    value: {
      handler: function () {
        this.initSelectedInfo()
      },

      immediate: true
    },

    inputVal: {
      handler (val) {
      }
    },

    expansion (val) {
    }
  },

  methods: {
    away ($event) {
      let className = $event.target.className
      // 结构千万不能改
      let name = className !== 'el-input__inner' ? className : $event.target?.parentNode?.parentNode.className

      if (name.indexOf('not-to-away') === -1) {
        this.cancel()
      }
    },
    
    PositionCalc (data) {
    },

    expansion (event, status) {
      this.isExpansion = status ?? !this.isExpansion
      this.$emit('switch', this.isExpansion)
    },

    cancel () {
      this.initSelectedInfo()
      this.$refs.transferSptions.initSelectedInfo()
      this.expansion('', false)
    },

    confirm () {
      this.$emit('update:value', this.options.filter(e => e.checked).map(e => e.value))
      this.expansion('', false)
    },

    clearableOperate () {
      this.options.filter(e => e.checked).forEach(e => {
        this.$set(e, 'checked', false)
      })
      
      this.selectedArr = []
      this.$refs.transferSptions.initSelectedInfo()
      this.inputVal = ''
      this.$emit('update:value', [])
      this.expansion('', false)
    },

    // 更新选中数据
    updateSelectInfo (data) {
      this.inputVal = data.map(e => e.label).join(', ')
    },

    // 初始化选中数据
    initSelectedInfo () {
      this.inputVal = this.value.join(', ')
      this.options.forEach(e => {
        this.$set(e, 'checked', this.value.includes(e.value))
      })
      this.selectedArr = this.options.filter(e => e.checked)
    }
  },

  created () {
  },

  mounted () {
    this.parentEle = this.$el
  }
}
</script>

<style lang="scss" scoped>
.sd-transfer{
  user-select: none;
  font-size: 12px;
  color: #fff;
  width: 100%;
  border-radius: 3px;
  background: $secondary-background;
  display: flex;
  align-content: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;

  .transfer-mask{
    position:absolute;
    top:0;
    left: 0;
    width: 160px;
    height: 100%;
    z-index: 99;
  }
  
  .transfer-contents{
    position: relative;
    width: calc(100% - 40px);

    /deep/ .el-input__inner{
      height: 28px;
      line-height: 27px;
      padding: 0 0 0 10px;
    }
  }

  
  .clearable{
    display: none;
    color: rgba(255, 255, 255, 0.4);
  }

  &:hover{
    .clearable{
      display: inline-block;
    }
  }

  .el-icon-arrow-down{
    width: 30px;
    // height: 30px;
    color:$primary-text;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:all 0.3s;
  }

  .icon-expansion{
    transform: rotate(-180deg);
  }
}
</style>
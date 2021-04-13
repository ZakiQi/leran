<!-- 下拉穿梭框 -->
<template>
  <div class="sd-transfer">
    <div class="transfer-contents" :title="inputVal" @click="PositionCalc($event)">
      <sd-input v-model="inputVal" size="mini" @focus="expansion($event, true)"></sd-input>
    </div>
    
    <i class="el-icon-delete clearable" @click="clearableOperate" style="line-height:28px;" v-if="!!inputVal"></i>
    <i :class="['el-icon-arrow-down', isExpansion && 'icon-expansion']" @click="expansion($event)"></i>

    <!-- 下拉框内容 -->
    <transfer-sptions
      :options="options"
      :show="isExpansion"
      :parent="parentEle"
      @updateSelectInfo="updateSelectInfo"
      @cancel="cancel"
      @confirm="confirm"
      >
    </transfer-sptions>
  </div>
</template>

<script>
import transferSptions from './transfer-sptions'

export default {
  name: 'sdTransfer',

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
    }
  },

  methods: {
    PositionCalc (data) {
    },

    expansion (event, status) {
      this.isExpansion = status ?? !this.isExpansion
    },

    cancel () {
      this.initSelectedInfo()
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
  
  .transfer-contents{
    width: calc(100% - 40px);

    /deep/ .el-input__inner{
      height: 28px;
      line-height: 27px;
    }
  }

  
  .clearable{
    display: none;
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
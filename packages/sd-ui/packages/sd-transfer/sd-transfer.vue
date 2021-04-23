<!-- 下拉穿梭框 -->
<template>
  <div class="sd-transfer">
    <div class="transfer-contents not-to-away" :title="inputVal">
      <div class="transfer-mask" @click.stop="selectClick"></div>
      <sd-input v-model="inputVal" size="mini" :placeholder="placeholder"></sd-input>
    </div>
    
    <i class="iconfont not-to-away clearable" style="line-height:26px;" v-show="!!inputVal" @click="clearableOperate">&#xe605;</i>
    <i :class="['el-icon-arrow-down', 'not-to-away', isExpansion && 'icon-expansion']" v-show="!inputVal" @click="expansion()"></i>

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
import Bus from '../../assets/js/bus'
import mask from '../mixins/mask-mixins'

export default {
  name: 'sdTransfer',

  mixins: [ clickaway, mask ],

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
      parentEle: {},
      uid: ''
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

    options: {
      handler : function () {
      },
      immediate: true
    },

    isExpansion (val) {
      this.maskWrap(val)
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

    selectClick () {
      Bus.$emit('cancelDialog', this._uid)
      this.expansion()
    },

    expansion (status) {
      this.isExpansion = status ?? !this.isExpansion
      this.$emit('switch', this.isExpansion)
    },

    cancel () {
      this.initSelectedInfo()
      this.$refs.transferSptions.initSelectedInfo()
      this.expansion(false)
    },

    confirm () {
      this.$emit('update:value', this.options.filter(e => e.checked).map(e => e.value))
      this.expansion(false)
    },

    clearableOperate () {
      Bus.$emit('cancelDialog', this._uid)

      this.options.filter(e => e.checked).forEach(e => {
        this.$set(e, 'checked', false)
      })
      
      this.selectedArr = []
      this.$refs.transferSptions.initSelectedInfo()
      this.$refs.transferSptions.all = false
      this.inputVal = ''
      this.$emit('update:value', [])
      this.expansion(false)
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
    let ts = this

    // 多个穿梭框显示，需要关闭其他穿梭困高
    Bus.$on('cancelDialog', function (e) {
      if (ts._uid !== e) {
        ts.cancel()
      }
    })
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
  border-radius: 2px;
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
    width: 100%;
    height: 100%;
    z-index: 99;
  }
  
  .transfer-contents{
    position: relative;
    width: calc(100% - 10px);

    /deep/ .el-input__inner{
      height: 26px;
      line-height: 26px;
      padding: 0 0 0 10px;
      font-size: $primary-text-12;
    }
  }

  
  .clearable{
    margin: 0 10px;
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
<!-- 穿梭框下拉内容 -->
<template>
<div :class="['sd-transfer-select', show && 'select-show']" :style="transferStyle" v-show="show">
  <div class="triangle" v-show="showTriangle"></div>
  <!-- 选项内容 -->
  <div class="sd-transfer-select-wrap">
    <div class="transfer-left-content">
      <!-- 搜索框 -->
      <div class="select-wrap">
        <!-- <i class="el-input__icon el-icon-search transfer-search" style="width: 20px;"></i> -->
        <i class="iconfont  transfer-search">&#xe614;</i>
        <el-input size="mini" class="transfer-search-input" placeholder="请输入名称搜索" v-model="searchVal">
        </el-input>
      </div>

      <!-- 条件框 -->
      <div class="original-data-wrap">
        <div class="original-tag-wrap" ref="scrollWrap" v-loading="loading">
          <div class="tag-contents" ref="tagContents" v-if="options.length">
            <div :class="['tag-wrap', e.checked && 'item-checked']" v-for="(e, i) in options" :key="i" v-show="!e.hide">
              <el-checkbox v-model="e.checked" :label="e.value" @change="optinsSelecting(e)">
                <div class="checkbox-text">
                  <i class="iconfont transfer-check" v-show="e.checked">&#xe609;</i>
                  <span :title="e.label">{{e.label}}</span>
                  <svg :class="['icon', 'options-add']" aria-hidden="true">
                    <use xlink:href="#sd-icx2Ferjitubiaox2Fzengjia"></use>
                  </svg>
                </div>
              </el-checkbox>
            </div>
          </div>
        </div>

        <div :class="[showDown && '-wrap-shadow', 'select-all-wrap']">
          <el-checkbox v-model="all" border size="mini" @change="selectAll">
            <span class="select-all">全选</span>
          </el-checkbox>
        </div>
      </div>

    </div>
    <div class="transfer-right-content">
      <!-- 已选择条件 -->
      <div :class="['seledted-wrap', selectedArr.length && 'seledted-num']">
        已添加 (
        <span class="selected-num">{{selectedArr.length || 0}}</span>
        )
      </div>

      <!-- 已选择标签 -->
      <div class="selected-data-wrap">
        <div class="select-content">
          <div v-if="selectedArr.length">
            <div class="selected-tag" v-for="(e, i) in selectedArr" :key="i">
              <span class="selected-item">{{e.label}}</span>
              <!-- 删除选中 -->
              <i class="iconfont icon-delete" @click="delSelected(e.value, i)">&#xe602;</i>
            </div>
          </div>

          <!-- 控状态 -->
          <div class="empty-wrap" v-else>
            <div class="empty-status">
              <div class="empty-svg"></div>
              <div class="empty-text">请从列表筛选添加</div>
            </div>
          </div>
        </div>
      
        <!-- footer 操作栏 -->
        <div class="sd-transfer-footer">
          <el-button class="transfer-btn transfer-cancel cancel-btn" size="mini" @click="cancel">取消</el-button>
          <el-button class="transfer-btn transfer-confirm" type="primary" size="mini" @click="confirm">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },

    parent: {
      type: [HTMLDivElement, Object],
      default: () => {}
    },

    options: {
      type: Array,
      immediate: true,
      default: () => []
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      transferStyle: {},
      searchVal: '',
      selectedArr: [],
      all: false,
      parentDom: {},
      // 是否显示阴影
      showDown: false,
      showTriangle: true
    }
  },

  watch: {
    show (val) {
      if (!val) {
        this.setPosition()
      } else {
        this.searchVal = ''
      }
    },

    searchVal (val) {
      this.filterTarget(val)

      this.checkedContrast()
    },

    options: {
      handler (data) {
        // 选项大于10显示阴影，后面会改成判断高度
        if (data.length >= 10) {
          this.showDown = true
        }
      },

      immediate: true
    }
  },

  methods: {
    checkedContrast () {
      let filterInfo = this.options.filter(e => !e.hide)
      this.all = filterInfo.length && !filterInfo.find(e => !e.checked)
    },
    // 定位
    setPosition () {
      // 内容部分高度360px
      // 判断距离底部的距离，如果小于360px，需要减去超出部分
      let parentDomBottomY = this.parentDom.getBoundingClientRect().y + 40
      let replenish = 0 // 需要向上补充的距离
      // 获取屏幕可视区域大小，减去dom底部距离 则为剩余空间大小
      let residueHg = window.innerHeight - parentDomBottomY
      if (residueHg < 360)  {
        replenish = 360 - residueHg
        this.showTriangle = false
      } else {
        this.showTriangle = true
      }

      let _top = this.parentDom.getBoundingClientRect().y + 45 - replenish
      let _left = this.parentDom.getBoundingClientRect().x

      this.transferStyle = {
        top: _top + 'px',
        left: _left + 'px'
      }
    },

    // 项目中可能会有父组件，要把父组件的距离加上
    getOffset (e, type) {
      var offset = type === 'top' ? e.offsetTop : e.offsetLeft
      if (e.offsetParent !== null) offset += this.getOffset(e.offsetParent, type);
      return offset;
    },

    // 取消
    cancel () {
      this.all = false
      this.$emit('cancel')
    },

    // 确定
    confirm () {
      this.$emit('confirm')
    },

    // 选项选择
    optinsSelecting (row) {
      this.selectedArr = this.options.filter(e => e.checked)

      // 全选状态处理
      if (row.checked) {
        !this.options.filter(e => !e.hide).find(e => !e.checked) && (this.all = true)
      } else {
        this.all = false
      }
    },

    // 删除选择
    delSelected (val, index) {
      let target = this.options.find(e => e.value === val)
      this.$set(target, 'checked', false)
      this.selectedArr.splice(index, 1)
      this.checkedContrast()
      this.$emit('updateSelectInfo', this.selectedArr)
    },

    // 初始化选中数据
    initSelectedInfo () {
      this.selectedArr = this.options.filter(e => e.checked)
    },

    // 搜索
    filterTarget (val) {
      this.options.forEach(e => {
        if (e.label.indexOf(val) !== -1) {
          this.$delete(e, 'hide')
        } else {
          this.$set(e, 'hide', 1)
        }
      })
    },

    // 全选
    selectAll () {
      if (this.all) {
        this.options.filter(e => !e.hide).forEach(e => this.$set(e, 'checked', true))
      } else {
        this.options.filter(e => !e.hide).forEach(e => this.$set(e, 'checked', false))
      }
      this.selectedArr = this.options.filter(e => e.checked)
    },

    showDownStyle () {
      let ph = this.$refs.scrollWrap?.offsetHeight || 290
      let ch = this.$refs.tagContents?.offsetHeight || 0
      console.log(ph, ch)

      this.showDown = ph < ch
    }
  },

  created () {
    this.initSelectedInfo()

    // 浏览器窗口发生变化时 改变内容定位
    window.onresize = () => {
      this.setPosition()
    }
  },

  mounted () {
    this.parentDom = this.$el.parentElement

    this.$nextTick( () => {
      this.setPosition()
      // 下拉dom要放在body上，防止外层div写了overflow：auto/hidden等属性
      document.body.insertBefore(this.$el, document.body.firstChild)
    })
  }
}
</script>

<style lang="scss">
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.sd-transfer-select{
  font-size: $primary-text-size;
  color: $primary-text;
  display: none;
  position: relative;
  width: 304px;
  height: 350px;
  background: $secondary-background;
  border-radius: 3px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  box-shadow: 0px 2px 10px -1px rgba(0, 0, 0, 0.32);

  .el-checkbox__input {
    display: none !important;
  }
}

.transfer-btn{
  font-size: 12px;
  width: 60px;
  height: 20px;
  padding: 0px 15px !important;
}

.transfer-cancel{
  background: transparent !important;
  border: 1px solid rgba(255,255,255, 0.2) !important;

  &:hover{
    border: 1px solid #409EFF !important;
  }
}

.transfer-confirm{
  margin: 0 10px !important;
}

.triangle{
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid $secondary-background;;
    position: absolute;
    bottom: 100%;
    left: 20%;
    transform: translate(-50%, 0%);
  }

.select-show{
  display: block;
}

.sd-transfer-select-wrap{
  height:  100%;
  flex-direction: row;

  & > div{
    &:first-child{
      border-right: 1px solid #5f6673;
    }
  }

  ::-webkit-input-placeholder {
    font-family: PingFangSC-Regular, PingFang SC !important;
    font-weight: 400 !important;
  }
}

.transfer-right-content, .transfer-left-content{
  overflow: hidden;
  float: left;
  height: 100%;
  box-sizing: border-box;
}

.transfer-left-content{
  width: calc(50% + 4px);
}

.transfer-right-content{
  width: calc(50% - 4px);
}


.sd-transfer-footer{
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
}

.select-content{
  width: 100%;
  height: calc(100% - 30px);
  padding: 3px;
  box-sizing: border-box;
  overflow: auto;
  
  .icon-delete {
    line-height: 30px;
    cursor: pointer;

    &:hover{
      color: #0077FF;
    }
  }
}

.empty-wrap{
    display: flex;
    align-items: center;
    height: calc(100% - 30px);
    justify-content: center;

  .empty-status{
    text-align: center;
  }

  .empty-svg{
    width: 100px;
    height: 80px;
    background-image: url('../../../assets/svg/empty.svg');
    background-repeat:no-repeat;
  }

  .empty-text{
    font-size: $primary-text-12;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $primary-text-opacity-4;
    margin-top: 10px;
  }
}

.selected-tag{
  height: 30px;
  float: left;
  width: 100%;
}

.selected-item{
  width:calc(100% - 20px);
  overflow: hidden;
  float: left;
  height: 100%;
  line-height: 30px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 16px;
}

.transfer-search-input{
  .el-input__inner{
    padding: 0;
    border-radius: 0px;
    color: $primary-text !important;
  }
}

.select-wrap, .seledted-wrap{
  font-size: $primary-text-12;
  color: $primary-text-opacity-6;
  padding: 0 10px;
  height: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #5f6673;
}

.select-wrap{
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  .transfer-search{
    font-size: $primary-text-size;
    line-height: 32px !important;
    color: $primary-text-opacity-4;
    text-align: left !important;
  }
}

.seledted-num{
  color: $primary-text;
}


.selected-num{
  // margin: 0 3px;
  // color: $color-primary;
}

.original-data-wrap, .selected-data-wrap{
  height: calc(100% - 30px);
  width: 100%;
}

.original-tag-wrap{
  height: calc(100% - 30px);
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-x: hidden;

  .el-loading-mask{
    background: none; 
  }
}



.select-all-wrap{
  padding-left: 10px;
  user-select: none;
  height: 30px;
  font-size: $primary-text-12;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  
  .select-all{
    line-height: 25px;
    color: $primary-text-opacity-6;
    font-size: $primary-text-12;
  }

  .el-checkbox__input{
    display: inline-block !important;
  }
  .is-bordered {
    border: none !important;
  }
  .el-checkbox__label{
    padding-left: 8px !important;
  }
  .el-checkbox.is-bordered.el-checkbox--mini{
    padding: 4px 0 !important;
  }
  .el-checkbox__inner{
    border: 1px solid $primary-text-opacity-4;
    background: transparent;
  }

  .el-checkbox{
    &:hover{
      .el-checkbox__inner{
        border: 1px solid #0077FF;      
      }
      .select-all{
        color: #0077FF;
      }
    }
  }
}

.scroll-wrap-shadow{
  box-shadow: 0px -6px 4px -1px rgba(0, 0, 0, 0.21);
  border-top: 1px solid transparent;
}

.tag-contents{
  width: 100%;
  overflow: hidden;
}

.selected-data-wrap{
  padding: 0;
}

.tag-wrap{
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 30px;

  .el-checkbox{
    display: inline-block;
    width: 100% !important;
  }

  .el-checkbox__label{
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
  }

  &:hover{
    background: #202C44;

    & .checkbox-text {
      color: $primary-text;
    }

    & .options-add{
      display: inline-block;
    }
  }
}

.checkbox-text{
  color: $primary-text-opacity-4;
  padding-left: 20px;
  height: 100%;
  line-height: 30px;
  position: relative;

  & span{
    display: block;
    width: calc(100% - 30px);
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    overflow: hidden;
  }

  .transfer-check{
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 12px;
  }
}

.item-checked{
 .checkbox-text{
   color: $primary-text;
 } 
}

.checkbox-text .options-add{
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  display: none;
}

/deep/ .el-checkbox{
  color: #fff;
}

.select-content{
  text-align: left;
}
</style>
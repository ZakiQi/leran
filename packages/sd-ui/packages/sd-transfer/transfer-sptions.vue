<!-- 穿梭框下拉内容 -->
<template>
<div :class="['sd-transfer-select', show && 'select-show']" :style="transferStyle" v-show="show">
  <div class="triangle"></div>
  <!-- 选项内容 -->
  <div class="sd-transfer-select-wrap">
    <div class="transfer-left-content">
      <!-- 搜索框 -->
      <div class="select-wrap">
        <el-input size="mini" class="transfer-search-input" v-model="searchVal">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>

      <!-- 条件框 -->
      <div class="original-data-wrap">
        <div class="original-tag-wrap">
          <div class="tag-contents">
            <div class="tag-wrap" v-for="(e, i) in options" :key="i" v-show="!e.hide">
              <el-checkbox v-model="e.checked" :label="e.value" @change="optinsSelecting(e)">
                <div class="checkbox-text">
                  <i class="el-icon-check transfer-check" v-show="e.checked"></i>
                  <span>{{e.label}}</span>
                </div>
              </el-checkbox>
            </div>
          </div>
        </div>

        <div class="select-all-wrap">
          <span class="select-all" @click="selectAll">全选</span>
        </div>
      </div>

    </div>
    <div class="transfer-right-content">
      <!-- 已选择条件 -->
      <div class="seledted-wrap">
        已选择(
        <span class="selected-num">{{selectedArr.length || 0}}</span>
        )
      </div>

      <!-- 已选择标签 -->
      <div class="selected-data-wrap">
        <div class="select-content">
          <div>
            <div class="selected-tag" v-for="(e, i) in selectedArr" :key="i">
              <span class="selected-item">{{e.label}}</span>
              <i class="el-icon-delete" @click="delSelected(e.value, i)"></i>
            </div>
          </div>
        </div>
      
        <!-- footer 操作栏 -->
        <div class="sd-transfer-footer">
          <!-- <span class="select-all">全选</span> -->
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
      immediate: true
    }
  },

  data () {
    return {
      transferStyle: {},
      searchVal: '',
      selectedArr: [],
      all: false,
      parentDom: {}
    }
  },

  watch: {
    show (val) {
      val && this.setPosition()
    },

    parent: {
      handler (data) {
      },

      immediate: true
    },

    searchVal (val) {
      this.filterTarget(val)
    }
  },

  methods: {
    
    // 定位
    setPosition () {
      let _top = this.parentDom.getBoundingClientRect().y + 50
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
      this.$emit('cancel')
    },

    // 确定
    confirm () {
      this.$emit('confirm')
    },

    // 选项选择
    optinsSelecting (row) {
      this.$set(row, 'checked', row.checked)
      this.selectedArr = this.options.filter(e => e.checked)
      this.$emit('updateSelectInfo', this.selectedArr)
    },

    // 删除选择
    delSelected (val, index) {
      let target = this.options.find(e => e.value === val)
      this.$set(target, 'checked', false)
      this.selectedArr.splice(index, 1)
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
      this.all = !this.all
      if (this.all) {
        this.options.forEach(e => this.$set(e, 'checked', true))
      } else {
        this.options.forEach(e => this.$set(e, 'checked', false))
      }
    }
  },

  created () {
    this.initSelectedInfo()
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
.sd-transfer-select{
  font-size: 12px;
  color: $primary-text;
  display: none;
  position: relative;
  width: 300px;
  height: 250px;
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
}

.transfer-right-content, .transfer-left-content{
  width: 50%;
  overflow: hidden;
  float: left;
  height: 100%;
  box-sizing: border-box;
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
  
  .el-icon-delete {
    display: none;
    line-height: 30px;
    cursor: pointer;

    &:hover{
      color: #0077FF;
    }
  }
}

.selected-tag{
  height: 30px;
  float: left;
  width: 100%;

  &:hover > i{
    display: block;
  }
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
  padding-left: 14px;
}

.transfer-search-input{
  /deep/ .el-input__inner{
    padding: 0;
    border-radius: 0px;
    color: #fff;
  }
}

.select-wrap, .seledted-wrap{
  padding: 0 5px;
  height: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #5f6673;
}

.selected-num{
  margin: 0 3px;
  color: $color-primary;
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
}

.select-all-wrap{
  user-select: none;
  height: 30px;
  box-shadow: 0px -6px 4px -1px rgba(0, 0, 0, 0.21);
  
  .select-all{
    line-height: 30px;
    margin-left: 25px;

    &:hover{
      color: #0077FF;
    }
  }
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
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 30px;

  /deep/ .el-checkbox{
    width: 100%;
  }

  /deep/ .el-checkbox__label{
    width: calc(100% - 25px);
  }

  &:hover{
    background: #202C44;
  }
}

.checkbox-text{
  font-size: 12px;
  color: #FFFFFF;
  padding-left: 16px;
  height: 100%;
  line-height: 30px;

  & span{
    display: block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    overflow: hidden;
  }
}

.transfer-check{
  position: absolute;
  top: 9px;
  left: 8px;
}

/deep/ .el-checkbox{
  color: #fff;
}

.select-content{
  text-align: left;
}
</style>
<!-- 下拉穿梭框 -->
<template>
  <div class="sd-transfer">
    <div class="transfer-contents" :title="inputVal">
      <sd-input v-model="inputVal" size="mini" @focus="expansion($event, true)"></sd-input>
    </div>
    
    <i class="el-icon-delete clearable" @click="clearableOperate" style="line-height:28px;" v-if="!!inputVal"></i>
    <i :class="['el-icon-arrow-down', isExpansion && 'icon-expansion']" @click="expansion"></i>

    <!-- 下拉框内容 -->
    <div :class="['sd-transfer-select', isExpansion && 'select-show']">
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
            <div class="tag-contents">
              <div class="tag-wrap" v-for="(e, i) in options" :key="i">
                <el-checkbox v-model="e.checked" :label="e.value" @change="optinsSelecting(e)">
                  <div class="checkbox-text">{{e.label}}</div>
                </el-checkbox>
              </div>
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
                  <span @click="delSelected(e.value, i)">{{e.label}}</span>
                </div>
              </div>
            </div>
            
            <!-- footer 操作栏 -->
            <div class="sd-transfer-footer">
              <el-button class="cancel-btn" size="mini" @click="cancel">取消</el-button>
              <el-button type="primary" size="mini" @click="confirm">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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

  data () {
    return {
      inputVal: '',
      searchVal: '',
      selectedArr: [],
      selectNum: 3,
      isExpansion: false
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
    updateSelectInfo () {
      this.inputVal = this.selectedArr.map(e => e.label).join(', ')
    },

    // 初始化选中数据
    initSelectedInfo () {
      this.inputVal = this.value.join(', ')
      this.options.forEach(e => {
        this.$set(e, 'checked', this.value.includes(e.value))
      })
      this.selectedArr = this.options.filter(e => e.checked)
    },

    // 选项选择
    optinsSelecting (row) {
      this.$set(row, 'checked', row.checked)
      this.selectedArr = this.options.filter(e => e.checked)
      this.updateSelectInfo()
    },

    // 删除选择
    delSelected (val, index) {
      let target = this.options.find(e => e.value === val)
      this.$set(target, 'checked', false)
      this.selectedArr.splice(index, 1)
      this.updateSelectInfo()
    }
  },

  created () {
  }
}
</script>

<style lang="scss" scoped>
.sd-transfer{
  font-size: 12px;
  color: #fff;
  width: 100%;
  border-radius: 3px;
  // border: 1px solid $secondary-background;
  background: $secondary-background;
  // min-height: 27px;
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

  .triangle{
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid $secondary-background;;
    position: absolute;
    bottom: 100%;
    left: 40%;
    transform: translate(-50%, 0%);
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

  .sd-transfer-select{
    display: none;
    position: relative;
    width: calc(100% + 100px);
    height: 250px;
    background: $secondary-background;
    border-radius: 3px;
    border: 1px solid $secondary-background;
    position: absolute;
    top: calc(100% + 20px);
    left: 0;
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
    height: 40px;
    border-top: 1px solid #5f6673;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .select-content{
    width: 100%;
    height: calc(100% - 40px);
    padding: 3px;
    box-sizing: border-box;
    overflow: auto;
  }

  .transfer-search-input{
    /deep/ .el-input__inner{
      border-bottom: 1px solid #999 !important;
      border-radius: 0px;
      color: #fff;
    }
  }

  .cancel-btn{
    margin-right: 10px;
  }

  .select-wrap, .seledted-wrap{
    padding: 0 5px;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #5f6673;
  }

  .selected-num{
    margin: 0 3px;
    color: $color-primary;
  }

  .original-data-wrap, .selected-data-wrap{
    height: calc(100% - 40px);
    width: 100%;
    overflow-y: auto;
    padding: 0 10px;
    box-sizing: border-box;
    overflow-x: hidden;
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

    /deep/ .el-checkbox{
      width: 100%;
    }

    /deep/ .el-checkbox__label{
      width: calc(100% - 25px);
    }
  }

  .checkbox-text{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    top: 5px;
  }

  /deep/ .el-checkbox{
    color: #fff;
  }

  .select-content{
    text-align: left;
  }
}
</style>
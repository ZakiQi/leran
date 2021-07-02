<template>
  <div style="width:100%">
    <!-- 横向列表 -->
    <div v-if="crosswiseList.length" ref="crosswiseList">
      <el-tooltip 
        v-for="(item, index) in crosswiseList"
        :key="index"
        class="item tip-box"
        effect="dark"
        placement="bottom"
        popper-class="draw_share_atooltip"
      > 
        <!-- item的tooltip的展示内容 -->
        <div slot="content" class="tip-content test test-5">
          <div class="tip-content-titile">{{item.name}}</div>
          <div class="tip-content-item scrollbar" v-for="(tipContent, tipContentIndex) in item.msg" :key="tipContentIndex">
            <div class="tip-content-text">{{tipContent}}</div>
          </div>
        </div>
        <!-- item的展示块 -->
        <button class="tip-btn">{{item.name}}</button>
      </el-tooltip>
    </div>

    <!-- 更多模块 -->
    <div class="more" @mouseleave="hideMoreList" v-if="isShowMoreBtn">
      <!-- 更多按钮 -->
      <div class="more-btn" @click="handleShowMoreList">更多>></div>
      <!-- 更多列表 -->
      <div class="more-list" v-show="isShowMoreList"  :style="positionLeft">
        <el-tooltip 
          v-for="(item, index) in moreList"
          :key="index"
          class="item tip-box display-block"
          effect="dark"
          placement="right"
          popper-class="draw_share_atooltip1"
        >
          <!-- item的tooltip的展示内容 -->
          <div slot="content" class="tip-content">
            <div class="tip-content-titile">{{item.name}}</div>
            <div class="tip-content-item" v-for="(tipContent, tipContentIndex) in item.msg" :key="tipContentIndex">
              <div class="tip-content-text">{{tipContent}}</div>
            </div>
          </div>
          <!-- item的展示块 -->
          <div class="tip-more-btn-box">
            <button class="tip-btn">{{item.name}}</button>
            <span class="iconfont sd-xian11"></span>
          </div>
        </el-tooltip>
        
      </div>
    </div>

    
  </div>
</template>

<script>
export default {
  name: "sdCascadeTip",

  data() {
    return {
      // 默认横向展示的item数据
      crosswiseList: [],
      // 更多列表数据
      moreList: [],
      // 子组件的宽度
      currContentWidth: '800px',
      // 默认横向展示的item数量
      displayItemNum: 0,
      // 更多模块展示的控制开关
      isShowMoreBtn: false,
      // 更多列表展示的控制开关
      isShowMoreList: false,
      positionLeft: 0,
    }
  },

  props: {
    // 传入的待处理数据
    options: {
      type: Array,
      default: () => []
    },

    // 传入的内容展示宽度
    contentWidth: {
      type: Number,
    },
  },

  mounted() {
    this.getContentWidth()
  },

  watch: {
    options: {
      handler : function () {
        this.splitList()
      },
    },

    contentWidth: {
      handler : function () {
        // this.getContentWidth(true)
      }
    },
  },

  methods: {
    // 切割默认展示及更多列表的数据
    splitList() {
      const splitLength = this.displayItemNum
      this.options.length && (this.crosswiseList = this.options.slice(0, splitLength))
      this.options.length > splitLength && (this.moreList = this.options.slice(splitLength, this.options.length))
      this.moreList.length && (this.isShowMoreBtn = true)
    },

    // 获取内容展示区宽度
    getContentWidth(isWatch) {
      // 如果用户传入了内容展示宽度，则按照自定义宽度来计算，否则取当前组件的宽度
      this.currContentWidth = isWatch ? this.contentWidth : (this.contentWidth ? this.contentWidth : this.$el.parentElement.clientWidth)
      this.calcAllowDisItemNum()
    },

    // 计算当前可展示的Item的数量
    calcAllowDisItemNum() {
      // 按照每个Item最大的宽度88px + 外边距8px来计算默认可展示的个数
      // 由于需要预留更多按钮及更多列表的展示空间因此需要在计算结果的基础上减二
      const itemNum = Math.floor(this.currContentWidth / 96) >= 2 ? Math.floor(this.currContentWidth / 96) - 2 : Math.floor(this.currContentWidth / 96) - 1
      this.displayItemNum = itemNum
      this.splitList()
    },

    // 控制更多列表展示
    handleShowMoreList(e) {
      !this.isShowMoreList && (this.positionLeft = `left:${e.target.offsetLeft + e.target.offsetWidth + 8}px`)
      this.isShowMoreList = !this.isShowMoreList
    },

    // 鼠标离开更多列表区域，则收起
    hideMoreList() {
      this.isShowMoreList = false
    }
  }
};
</script>

<style lang="scss">
  // 提示信息的每一个item的样式
  .tip-box {
    float: left;
    margin-right: 8px;
    cursor: pointer;
  }
  
  // item展示块样式
  .tip-btn {
    max-width: 86px;
    height: 22px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 20px;
    background: rgba(24, 144, 255, 0.05);
    border-radius: 4px;
    border: 1px solid rgba(24, 144, 255, 0.35);
    color: #1890FF;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  // tooltip的展示样式
  .tip-content {
    font-family: PingFangSC-Regular, PingFang SC;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 300px;
    width: auto;
    max-width: 500px;

    .tip-content-titile {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .tip-content-item {
      margin-bottom: 2px;
      width: 100%;
      
      .tip-content-text {
        color: rgba(255, 255, 255, 0.6);
        line-height: 17px;
        font-size: 12px;
      }
    }
  }

  // 横向展示的item的tooltip默认样式修改
  .draw_share_atooltip {
    background: #303B55 !important;
    box-shadow: 0px 2px 8px 0px #00002E;
    min-width: 100px;
    max-width: 500px;
    .popper__arrow::after {
      border-bottom-color: #303B55 !important;
    }
    .popper__arrow {
      border-bottom-color: #303B55 !important;
    }
  }
  // 更多列表中展示的item的tooltip默认样式修改
  .draw_share_atooltip1 {
    background: #303B55 !important;
    box-shadow: 0px 2px 8px 0px #00002E;
    min-width: 100px;
    max-width: 500px;
    .popper__arrow::after {
      border-right-color: #303B55 !important;
    }
    .popper__arrow {
      border-right-color: #303B55 !important;
    }
  }

  // 更多按钮样式
  .more {
    float: left;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #1890FF;
    line-height: 20px;

    // 更多按钮
    .more-btn {
      float: left;
      margin-right: 10px;
      user-select: none;
      cursor: pointer;
    }

    // 更多列表样式
    .more-list {
      position: absolute;
      background: #303B55;
      box-shadow: 0px 2px 8px 0px #00002E;
      padding: 12.28px 0px 11px 10px;

      .tip-more-btn-box {
        border-radius: 4px;
        width: 100%;
        text-align: left;
        cursor: pointer;

        .tip-btn {
          background: transparent;
          border: 1px solid rgba(24, 144, 255, 0.35);
        }
        .sd-xian11 {
          color: rgba(24, 144, 255, 0.35);
          font-size: 16px;
          font-weight: 600;
        }
      }

      .tip-more-btn-box:not(:last-child) {
        margin-bottom: 8px;
      }

      .tip-btn {
        margin-bottom: 0;
      }
    }
  }

  // 清除浮动
  .display-block {
    clear: both;
  }

  // ::-webkit-scrollbar {
  //   /*滚动条整体样式*/
  //   width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  //   height: 10px;
  // }
  // ::-webkit-scrollbar-thumb {
  //   /*滚动条里面小方块*/
  //   border-radius: 10px;
  //   background-color: #57637e;
  // }
  // ::-webkit-scrollbar-track {
  //   /*滚动条里面轨道*/
  //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  //   border-radius: 10px;
  // }

  // ::-webkit-scrollbar-corner {
  //   /*滚动条里面轨道交汇处*/
  //   background: transparent;
  // }
</style>
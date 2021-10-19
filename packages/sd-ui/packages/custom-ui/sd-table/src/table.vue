<template>
  <div class="sd-table">
    <!-- 隐藏列: slot里容纳table-column -->
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>

    <div class="sd-table__header-wrapper" ref="headerWrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"
      ></table-header>
    </div>

    <div
      class="sd-table__body-wrapper"
      ref="bodyWrapper"
      :style="{
        width: bodyWidth
      }"
    >
      <table-body
        :context="context"
        :store="store"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
      ></table-body>
    </div>
  </div>
</template>

<script>
export function debounce(fn, delay = 50) {
  // 定时器，用来 setTimeout
  var timer

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function() {
    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

import { addResizeListener, removeResizeListener } from './config'
// 表格状态管理工具
import TableStore from './table-store'
import TableLayout from './table-layout'
import TableBody from './table-body'
import TableHeader from './table-header'

let tableIdSeed = 1
export default {
  name: 'sdTable',
  components: {
    TableHeader,
    TableBody
  },
  props: {
    data: { type: Array, default: () => [] },

    fit: {
      type: Boolean,
      default: true
    },

    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],

    rowKey: [String, Function],

    context: {},

    rowClassName: [String, Function],

    rowStyle: [Object, Function],

    cellClassName: [String, Function],

    cellStyle: [Object, Function],

    headerRowClassName: [String, Function],

    headerRowStyle: [Object, Function],

    headerCellClassName: [String, Function],

    headerCellStyle: [Object, Function]
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        // 供 table-body computed.data 使用
        this.store.commit('setData', value)
        if (this.$ready) {
          this.$nextTick(() => {
            this.doLayout()
          })
        }
      }
    },
    height: {
      immediate: true,
      handler(value) {
        this.layout.setHeight(value)
      }
    },
    maxHeight: {
      immediate: true,
      handler(value) {
        this.layout.setMaxHeight(value)
      }
    }
  },
  data() {
    const store = new TableStore(this, {
      rowKey: this.rowKey
    })
    const layout = new TableLayout({ table: this, store, fit: this.fit })
    return {
      store,
      layout,
      renderExpanded: null,
      resizeState: {
        width: null,
        height: null
      }
    }
  },
  computed: {
    shouldUpdateHeight() {
      return this.height || this.maxHeight
    },
    bodyWrapper() {
      return this.$refs.bodyWrapper
    },
    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : ''
    }
  },
  created() {
    this.tableId = `sd-table_${tableIdSeed}`
    tableIdSeed += 1
    // 提供给table-store的TableStore.prototype.scheduleLayout使用
    this.debouncedUpdateLayout = debounce(() => this.doLayout(), 50)
  },
  mounted() {
    this.bindEvents()

    // 更新columns与originColumns从而触发table-header、table-body更新
    this.store.updateColumns()
    this.doLayout()

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    }
    this.$ready = true
  },
  methods: {
    bindEvents() {
      this.bodyWrapper.addEventListener('scroll', this.syncPostion, { passive: true })
      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener)
      }
    },
    unbindEvents() {
      this.bodyWrapper.removeEventListener('scroll', this.syncPostion, { passive: true })
      if (this.fit) {
        removeResizeListener(this.$el, this.resizeListener)
      }
    },

    resizeListener() {
      if (!this.$ready) return
      let shouldUpdateLayout = false
      const el = this.$el
      const { width: oldWidth, height: oldHeight } = this.resizeState

      const width = el.offsetWidth
      if (oldWidth !== width) {
        shouldUpdateLayout = true
      }

      const height = el.offsetHeight
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width
        this.resizeState.height = height
        this.doLayout()
      }
    },
    doLayout() {
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight()
      }
      this.layout.updateColumnsWidth()
      // this.layout.setHeight(this.height)
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../style/table';
@import '../../scss/table';
</style>

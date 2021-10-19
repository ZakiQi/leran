// eslint-disable-next-line no-unused-vars
import {
  parseWidth,
  parseMinWidth,
  mergeOptions,
  cellStarts,
  cellForced,
  compose,
  defaultRenderCell
} from './config'

let columnIdSeed = 1
import '../../scss/table.scss'
export default {
  name: 'sdTableColumn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    formatter: Function,
    columnKey: String,
    fixed: [Boolean, String],
    align: String,
    headerAlign: String,
    context: {},
    index: [Number, Function] // 用于指定列位置
  },

  computed: {
    owner() {
      // 寻找拥有tableId的外层组件
      let parent = this.$parent
      while (parent && !parent.tableId) {
        // 见table.vue line 454，为tableId赋值
        parent = parent.$parent
      }
      return parent
    },

    columnOrTableParent() {
      // 寻找拥有tableId 或 columnId的外层组件
      let parent = this.$parent
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent
      }
      return parent
    },

    realWidth() {
      return parseWidth(this.width)
    },

    realMinWidth() {
      return parseMinWidth(this.minWidth)
    },

    realAlign() {
      return this.align ? 'is-' + this.align : null
    },

    realHeaderAlign() {
      return this.headerAlign ? 'is-' + this.headerAlign : this.realAlign
    }
  },

  watch: {
    label(newVal) {
      if (this.columnConfig) {
        this.columnConfig.label = newVal
      }
    },

    prop(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal
      }
    },

    width(newVal) {
      if (this.columnConfig) {
        this.columnConfig.width = parseWidth(newVal)
        this.owner.store.scheduleLayout()
      }
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: []
    }
  },

  beforeCreate() {
    this.row = {}
    this.column = {}
    this.$index = 0
    this.columnId = ''
  },

  created() {
    const parent = this.columnOrTableParent
    this.isSubColumn = this.owner !== parent
    this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++
    const type = this.type || 'default'
    // eslint-disable-next-line no-unused-vars
    const defaults = {
      ...cellStarts[type],
      id: this.columnId,
      type: type,
      property: this.prop || this.property,
      align: this.realAlign,
      headerAlign: this.realHeaderAlign,
      // index 列
      index: this.index,
      formatter: this.formatter,
      context: this.context
    }
    const basicProps = [
      'columnKey',
      'label',
      'className',
      'labelClassName',
      'type',
      'renderHeader',
      'formatter',
      'fixed',
      'resizable'
    ]
    // 没有用  sortProps selectProps filterProps
    const sortProps = ['sortMethod', 'sortBy', 'sortOrders']
    const selectProps = ['selectable', 'reserveSelection']
    const filterProps = [
      'filterMethod',
      'filters',
      'filterMultiple',
      'filterOpened',
      'filteredValue',
      'filterPlacement'
    ]

    let column = this.getPropsData(basicProps, sortProps, selectProps, filterProps)
    column = mergeOptions(defaults, column)

    // 注意 compose 中函数执行的顺序是从右到左
    const chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps)
    column = chains(column)

    this.columnConfig = column

    // 注册 watcher
    this.registerNormalWatchers()
    this.registerComplexWatchers()
  },

  destroyed() {
    if (!this.$parent) return
    const parent = this.$parent
    this.owner.store.commit(
      'removeColumn',
      this.columnConfig,
      this.isSubColumn ? parent.columnConfig : null
    )
  },

  mounted() {
    const owner = this.owner
    const parent = this.columnOrTableParent
    const children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children
    const columnIndex = this.getColumnElIndex(children, this.$el)
    owner.store.commit(
      'insertColumn',
      this.columnConfig,
      columnIndex,
      this.isSubColumn ? parent.columnConfig : null
    )
  },

  methods: {
    getPropsData(...props) {
      return props.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((key) => {
            prev[key] = this[key]
          })
        }
        return prev
      }, {})
    },

    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child)
    },

    setColumnWidth(column) {
      if (this.realWidth) {
        column.width = this.realWidth
      }
      if (this.realMinWidth) {
        column.minWidth = this.realMinWidth
      }
      if (!column.minWidth) {
        column.minWidth = 80
      }
      column.realWidth = column.width === undefined ? column.minWidth : column.width
      return column
    },

    setColumnRenders(column) {
      if (this.renderHeader) {
        console.warn(
          '[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.'
        )
      } else if (column.type !== 'selection') {
        column.renderHeader = (h, scope) => {
          const renderHeader = this.$scopedSlots.header
          return renderHeader ? renderHeader(scope) : column.label
        }
      }

      let originRenderCell = column.renderCell
      originRenderCell = originRenderCell || defaultRenderCell

      originRenderCell = originRenderCell || defaultRenderCell
      // 对 renderCell 进行包装
      column.renderCell = (h, data) => {
        let children = null
        if (this.$scopedSlots.default) {
          children = this.$scopedSlots.default(data)
        } else {
          children = originRenderCell(h, data)
        }
        const props = {
          class: 'cell',
          style: {}
        }
        if (column.showOverflowTooltip) {
          props.class += ' el-tooltip'
          props.style = { width: (data.column.realWidth || data.column.width) - 1 + 'px' }
        }
        return <div {...props}>{children}</div>
      }

      return column
    },

    setColumnForcedProps(column) {
      // 对于特定类型的 column，某些属性不允许设置
      const type = column.type
      const source = cellForced[type] || {}
      Object.keys(source).forEach((prop) => {
        let value = source[prop]
        if (value !== undefined) {
          column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value
        }
      })

      return column
    },

    registerNormalWatchers() {
      const props = [
        'label',
        'property',
        'filters',
        'filterMultiple',
        'sortable',
        'index',
        'formatter',
        'className',
        'labelClassName',
        'showOverflowTooltip'
      ]
      // 一些属性具有别名
      const aliases = {
        prop: 'property',
        realAlign: 'align',
        realHeaderAlign: 'headerAlign',
        realWidth: 'width'
      }
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur
        return prev
      }, aliases)

      Object.keys(allAliases).forEach((key) => {
        const columnKey = aliases[key]

        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal
        })
      })
    },

    registerComplexWatchers() {
      const props = ['fixed']
      const aliases = {
        realWidth: 'width',
        realMinWidth: 'minWidth'
      }
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur
        return prev
      }, aliases)

      Object.keys(allAliases).forEach((key) => {
        const columnKey = aliases[key]

        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal
          const updateColumns = columnKey === 'fixed'
          this.owner.store.scheduleLayout(updateColumns)
        })
      })
    }
  },

  render(h) {
    // slots 也要渲染，需要计算合并表头
    return h('div', this.$slots.default)
  }
}

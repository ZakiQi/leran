/* Table状态管理 */

const TableStore = function(table, initialState = {}) {
  if (!table) {
    throw new Error('Table is required.')
  }

  this.table = table
  this.states = {
    // 3.0 版本后要求必须设置该属性
    rowKey: null,

    // 渲染的数据来源，是对 table 中的 data 过滤排序后的结果
    data: [],

    // 是否包含固定列
    isComplex: false,

    // 列
    _columns: [], // 不可响应的
    originColumns: [],
    columns: [],
    fixedColumns: [],
    rightFixedColumns: [],
    leafColumns: [],
    fixedLeafColumns: [],
    rightFixedLeafColumns: [],
    leafColumnsLength: 0,
    fixedLeafColumnsLength: 0,
    rightFixedLeafColumnsLength: 0
  }

  // 属性拷贝
  for (let prop in initialState) {
    // eslint-disable-next-line no-prototype-builtins
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop]
    }
  }
}

const doFlattenColumns = (columns) => {
  const result = []
  columns.forEach((column) => {
    // .....
    result.push(column)
  })
  return result
}

// 重新规划布局
TableStore.prototype.scheduleLayout = function(updateColumns) {
  if (updateColumns) {
    this.updateColumns()
  }
  this.table.debouncedUpdateLayout()
}

TableStore.prototype.updateColumns = function() {
  const states = this.states
  const _columns = states._columns || []
  states.fixedColumns = _columns.filter((column) => column.fixed === true || column.fixed === 'left')
  states.rightFixedColumns = _columns.filter((column) => column.fixed === 'right')

  if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
    _columns[0].fixed = true
    states.fixedColumns.unshift(_columns[0])
  }

  const notFixedColumns = _columns.filter((column) => !column.fixed)
  states.originColumns = []
    .concat(states.fixedColumns)
    .concat(notFixedColumns)
    .concat(states.rightFixedColumns)

  const leafColumns = doFlattenColumns(notFixedColumns)
  const fixedLeafColumns = doFlattenColumns(states.fixedColumns)
  const rightFixedLeafColumns = doFlattenColumns(states.rightFixedColumns)

  states.leafColumnsLength = leafColumns.length
  states.fixedLeafColumnsLength = fixedLeafColumns.length
  states.rightFixedLeafColumnsLength = rightFixedLeafColumns.length

  states.columns = []
    .concat(fixedLeafColumns)
    .concat(leafColumns)
    .concat(rightFixedLeafColumns)
  states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0
}

TableStore.prototype.mutations = {
  handleRowClick(row) {
    this.table.$emit('row-click', row)
  },
  handleHoverEvent(row) {
    this.table.$emit('row-hover', row)
  },
  // table.vue watch.data 调用
  // table.vue watch.data 调用
  setData(states, data) {
    // ......
    states._data = data
    states.data = data
    // ......
  },

  // eslint-disable-next-line no-unused-vars
  insertColumn(states, column, index, parent) {
    let array = states._columns
    // ......

    if (typeof index !== 'undefined') {
      // 在index的位置插入column
      array.splice(index, 0, column)
    } else {
      array.push(column)
    }

    // .....
  },

  removeColumn(states, column, parent) {
    let array = states._columns
    if (parent) {
      array = parent.children
      if (!array) array = parent.children = []
    }
    if (array) {
      array.splice(array.indexOf(column), 1)
    }

    if (this.table.$ready) {
      this.updateColumns() // hack for dynamics remove column
      this.scheduleLayout()
    }
  }
}
TableStore.prototype.commit = function commit(name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args))
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}

export default TableStore

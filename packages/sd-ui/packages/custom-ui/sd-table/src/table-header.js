/* eslint-disable no-unused-vars */
const getAllColumns = (columns) => {
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      result.push(column)
      result.push.apply(result, getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

const convertToRows = (originColumns) => {
  let maxLevel = 1
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      column.colSpan = 1
    }
  }

  originColumns.forEach((column) => {
    column.level = 1
    traverse(column)
  })

  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns)

  allColumns.forEach((column) => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1
    } else {
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })

  return rows
}

import LayoutObserver from './layout-observer'
import '../../scss/table.scss'
export default {
  name: 'SdTableHeader',
  mixins: [LayoutObserver],

  props: {
    fixed: String,
    store: {
      required: true
    }
  },
  computed: {
    table() {
      return this.$parent
    },
    hasGutter() {
      return !this.fixed && this.tableLayout.gutterWidth
    },
    columns() {
      return this.store.states.columns
    },
    leftFixedLeafCount() {
      return this.store.states.fixedLeafColumnsLength
    },
    rightFixedLeafCount() {
      return this.store.states.rightFixedLeafColumnsLength
    },
    columnsCount() {
      return this.store.states.columns.length
    },
    leftFixedCount() {
      return this.store.states.fixedColumns.length
    },
    rightFixedCount() {
      return this.store.states.rightFixedColumns.length
    }
  },
  methods: {
    isCellHidden(index, columns) {
      let start = 0
      for (let i = 0; i < index; i++) {
        start += columns[i].colSpan
      }
      const after = start + columns[index].colSpan - 1
      if (this.fixed === true || this.fixed === 'left') {
        console.log('1', after >= this.leftFixedLeafCount)
        return after >= this.leftFixedLeafCount
      } else if (this.fixed === 'right') {
        console.log('2', after >= start < this.columnsCount - this.rightFixedLeafCount)

        return start < this.columnsCount - this.rightFixedLeafCount
      } else {
        console.log(
          '3',
          after < this.leftFixedLeafCount || start >= this.columnsCount - this.rightFixedLeafCount
        )
        return (
          after < this.leftFixedLeafCount || start >= this.columnsCount - this.rightFixedLeafCount
        )
      }
    },
    getHeaderRowClass(rowIndex) {
      const classes = []

      const headerRowClassName = this.table.headerRowClassName
      if (typeof headerRowClassName === 'string') {
        classes.push(headerRowClassName)
      } else if (typeof headerRowClassName === 'function') {
        classes.push(headerRowClassName.call(null, { rowIndex }))
      }

      return classes.join(' ')
    },

    getHeaderRowStyle(rowIndex) {
      const headerRowStyle = this.table.headerRowStyle
      if (typeof headerRowStyle === 'function') {
        return headerRowStyle.call(null, { rowIndex })
      }
      return headerRowStyle
    },
    getHeaderCellStyle(rowIndex, columnIndex, row, column) {
      const headerCellStyle = this.table.headerCellStyle
      if (typeof headerCellStyle === 'function') {
        return headerCellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        })
      }
      return headerCellStyle
    },

    getHeaderCellClass(rowIndex, columnIndex, row, column) {
      const classes = [
        column.id,
        column.order,
        column.headerAlign,
        column.className,
        column.labelClassName
      ]

      if (rowIndex === 0 && this.isCellHidden(columnIndex, row)) {
        classes.push('is-hidden')
      }

      if (!column.children) {
        classes.push('is-leaf')
      }

      if (column.sortable) {
        classes.push('is-sortable')
      }

      const headerCellClassName = this.table.headerCellClassName

      if (typeof headerCellClassName === 'string') {
        classes.push(headerCellClassName)
      } else if (typeof headerCellClassName === 'function') {
        classes.push(
          headerCellClassName.call(null, {
            rowIndex,
            columnIndex,
            row,
            column
          })
        )
      }

      return classes.join(' ')
    }
  },
  render(h) {
    const originColumns = this.store.states.originColumns
    const columnRows = convertToRows(originColumns, this.columns)
    return (
      <table class='sd-table__header' cellspacing='0' cellpadding='0' border='0'>
        <colgroup>
          {this.columns.map((column) => (
            <col name={column.id} key={column.id} />
          ))}
        </colgroup>

        <thead>
          {this._l(columnRows, (columns, rowIndex) => (
            <tr style={this.getHeaderRowStyle(rowIndex)} class={this.getHeaderRowClass(rowIndex)}>
              {columns.map((column, cellIndex) => (
                <th
                  colspan={column.colSpan}
                  rowspan={column.rowSpan}
                  style={this.getHeaderCellStyle(rowIndex, cellIndex, columns, column)}
                  class={[
                    'sd-table__cell',
                    this.getHeaderCellClass(rowIndex, cellIndex, columns, column)
                  ]}
                  key={column.id}
                >
                  <div class={['cell', column.labelClassName]}>
                    {column.renderHeader
                      ? column.renderHeader.call(this._renderProxy, h, {
                          column,
                          $index: cellIndex,
                          store: this.store,
                          _self: this.$parent.$vnode.context
                        })
                      : column.label}
                  </div>
                </th>
              ))}
              {this.hasGutter ? <th class='gutter'></th> : ''}
            </tr>
          ))}
        </thead>
      </table>
    )
  }
}

/* eslint-disable no-unused-vars */
import LayoutObserver from './layout-observer'
import '../../scss/table.scss'
export default {
  name: 'SdTableBody',
  mixins: [LayoutObserver],
  props: {
    fixed: String,
    store: {
      required: true
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    context: {}
  },
  computed: {
    table() {
      return this.$parent
    },
    data() {
      //获取状态管理器中的列表数据
      return this.store.states.data
    },
    columns() {
      //获取状态管理器中的列定义
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
    },
    hasExpandColumn() {
      return this.store.states.columns.some(({ type }) => type === 'expand')
    }
  },

  methods: {
    getKeyOfRow(row, index) {
      const rowKey = this.table.rowKey
      if (rowKey) {
        return this.getRowIdentity(row, rowKey)
      }
      return index
    },

    getRowIdentity(row, rowKey) {
      if (!row) throw new Error('row is required when get row identity')
      if (typeof rowKey === 'string') {
        if (rowKey.indexOf('.') < 0) {
          return row[rowKey]
        }
        let key = rowKey.split('.')
        let current = row
        for (let i = 0; i < key.length; i++) {
          current = current[key[i]]
        }
        return current
      } else if (typeof rowKey === 'function') {
        return rowKey.call(null, row)
      }
    },
    isColumnHidden(index) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedLeafCount
      } else if (this.fixed === 'right') {
        return index < this.columnsCount - this.rightFixedLeafCount
      } else {
        return (
          index < this.leftFixedLeafCount || index >= this.columnsCount - this.rightFixedLeafCount
        )
      }
    },
    getRowStyle(row, rowIndex) {
      const rowStyle = this.table.rowStyle
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, {
          row,
          rowIndex
        })
      }
      return rowStyle
    },
    getRowClass(row, rowIndex) {
      const classes = ['sd-table__row']
      if (this.table.highlightCurrentRow && row === this.store.states.currentRow) {
        classes.push('current-row')
      }

      if (this.stripe && rowIndex % 2 === 1) {
        classes.push('sd-table__row--striped')
      }
      const rowClassName = this.table.rowClassName
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName)
      } else if (typeof rowClassName === 'function') {
        classes.push(
          rowClassName.call(null, {
            row,
            rowIndex
          })
        )
      }

      if (this.store.states?.expandRows?.indexOf(row) > -1) {
        classes.push('expanded')
      }

      return classes
    },

    getCellStyle(rowIndex, columnIndex, row, column) {
      const cellStyle = this.table.cellStyle
      if (typeof cellStyle === 'function') {
        return cellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        })
      }
      return cellStyle
    },

    getCellClass(rowIndex, columnIndex, row, column) {
      const classes = [column.id, column.align, column.className]

      if (this.isColumnHidden(columnIndex)) {
        classes.push('is-hidden')
      }

      const cellClassName = this.table.cellClassName
      if (typeof cellClassName === 'string') {
        classes.push(cellClassName)
      } else if (typeof cellClassName === 'function') {
        classes.push(
          cellClassName.call(null, {
            rowIndex,
            columnIndex,
            row,
            column
          })
        )
      }

      return classes.join(' ')
    },

    getSpan(row, column, rowIndex, columnIndex) {
      let rowspan = 1
      let colspan = 1
      const fn = this.table.spanMethod
      if (typeof fn === 'function') {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex
        })
        if (Array.isArray(result)) {
          rowspan = result[0]
          colspan = result[1]
        } else if (typeof result === 'object') {
          rowspan = result.rowspan
          colspan = result.colspan
        }
      }
      return { rowspan, colspan }
    },

    getColspanRealWidth(columns, colspan, index) {
      if (colspan < 1) {
        return columns[index].realWidth
      }
      const widthArr = columns.map(({ realWidth }) => realWidth).slice(index, index + colspan)
      return widthArr.reduce((acc, width) => acc + width, -1)
    },

    // 渲染
    wrappedRowRender(row, $index) {
      return this.rowRender(row, $index)
    },

    rowRender(row, $index, treeRowData) {
      const { columns } = this
      const columnsHidden = columns.map((column, index) => this.isColumnHidden(index))
      const rowClasses = this.getRowClass(row, $index)
      let display = true
      let displayStyle = display
        ? null
        : {
            display: 'none'
          }

      return (
        <tr
          style={[displayStyle, this.getRowStyle(row, $index)]}
          class={rowClasses}
          key={this.getKeyOfRow(row, $index)}
        >
          {columns.map((column, cellIndex) => {
            const { rowspan, colspan } = this.getSpan(row, column, $index, cellIndex)
            if (!rowspan || !colspan) {
              return null
            }
            const columnData = { ...column }
            columnData.realWidth = this.getColspanRealWidth(columns, colspan, cellIndex)
            const data = {
              store: this.store,
              _self: this.context || this.table.$vnode.context,
              column: columnData,
              row,
              $index
            }

            return (
              <td
                // 'sd-table__cell'
                style={this.getCellStyle($index, cellIndex, row, column)}
                class={[this.getCellClass($index, cellIndex, row, column)]}
                rowspan={rowspan}
                colspan={colspan}
              >
                {column.renderCell.call(
                  this._renderProxy,
                  this.$createElement,
                  data,
                  columnsHidden[cellIndex]
                )}
              </td>
            )
          })}
        </tr>
      )
    }
  },

  render() {
    const data = this.data || []
    // width={column.width ? column.width : ''}
    return (
      <table class='sd-table__body' cellspacing='0' cellpadding='0' border='0'>
        <colgroup>
          {this.columns.map((column) => (
            <col name={column.id} key={column.id} />
          ))}
        </colgroup>
        <tbody>
          {data.reduce((acc, row) => {
            return acc.concat(this.wrappedRowRender(row, acc.length))
          }, [])}
        </tbody>
      </table>
    )
  }
}

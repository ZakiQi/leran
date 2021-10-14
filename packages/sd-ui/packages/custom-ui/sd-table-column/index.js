import sdTableColumn from '../sd-table/src/table-column'

/* istanbul ignore next */
sdTableColumn.install = function(Vue) {
  Vue.component(sdTableColumn.name, sdTableColumn)
}

export default sdTableColumn

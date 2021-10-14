import sdTable from './src/table'

/* istanbul ignore next */
sdTable.install = function(Vue) {
  Vue.component(sdTable.name, sdTable)
}

export default sdTable

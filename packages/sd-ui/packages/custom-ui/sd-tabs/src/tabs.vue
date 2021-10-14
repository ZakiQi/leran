<script>
import TabNav from './tab-nav'
export default {
  name: 'sdTabs',
  components: {
    TabNav
  },
  props: {
    // 风格类型	string	card/border-card	—
    type: String,

    activeName: String,
    // 标签是否可关闭	boolean	—	false
    closable: Boolean,
    // 标签是否可增加	boolean	—	false
    addable: Boolean,
    value: {},
    // 标签是否同时可增加和关闭	boolean	—	false
    editable: Boolean,
    // 选项卡所在位置	string	top/right/bottom/left	top
    tabPosition: {
      type: String,
      default: 'top'
    },
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。	Function(activeName, oldActiveName)
    beforeLeave: Function,
    // 标签的宽度是否自撑开	boolean	-	false
    stretch: Boolean
  },

  provide() {
    return {
      rootTabs: this
    }
  },

  watch: {
    activeName(value) {
      this.setCurrentName(value)
    },
    value(value) {
      this.setCurrentName(value)
    },
    currentName() {
      if (this.$refs.nav) {
        this.$nextTick(() => {
          this.$refs.nav.$nextTick(() => {
            this.$refs.nav.scrollToActiveTab()
          })
        })
      }
    }
  },

  data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    }
  },

  methods: {
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(
          (vnode) =>
            vnode.tag &&
            vnode.componentOptions &&
            vnode.componentOptions.Ctor.options.name === 'sdTabPane'
        )

        const panes = paneSlots.map(({ componentInstance }) => componentInstance)
        const panesChanged = !(
          panes.length === this.panes.length &&
          panes.every((pane, index) => pane === this.panes[index])
        )
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    },

    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return
      this.setCurrentName(tabName)
      this.$emit('tab-click', tab, event)
    },

    setCurrentName(value) {
      const changeCurrentName = () => {
        this.currentName = value
        this.$emit('input', value)
      }
      if (this.currentName !== value && this.beforeLeave) {
        const before = this.beforeLeave(value, this.currentName)
        if (before && before.then) {
          before.then(
            () => {
              changeCurrentName()
              this.$refs.nav && this.$refs.nav.removeFocus()
            },
            () => {
              // https://github.com/ElemeFE/element/pull/14816
              // ignore promise rejection in `before-leave` hook
            }
          )
        } else if (before !== false) {
          changeCurrentName()
        }
      } else {
        changeCurrentName()
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  render: function(h) {
    // eslint-disable-next-line no-unused-vars
    let {
      type,
      handleTabClick,
      handleTabRemove,
      handleTabAdd,
      currentName,
      panes,
      editable,
      addable,
      tabPosition,
      stretch
    } = this
    const navData = {
      props: {
        currentName,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        editable,
        type,
        panes,
        stretch
      },
      ref: 'nav'
    }

    const header = (
      <div class={['sd-tabs__header', `is-${tabPosition}`]}>
        <tab-nav {...navData}></tab-nav>
      </div>
    )
    const panels = <div class='sd-tabs__content'>{this.$slots.default}</div>

    return (
      <div
        class={{
          'sd-tabs': true,
          'sd-tabs--card': type === 'card',
          [`sd-tabs--${tabPosition}`]: true,
          'sd-tabs--border-card': type === 'border-card'
        }}
      >
        {tabPosition !== 'bottom' ? [header, panels] : [panels, header]}
      </div>
    )
  },

  created() {
    if (!this.currentName) {
      this.setCurrentName('0')
    }
    this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true))
  },

  mounted() {
    this.calcPaneInstances()
  },

  updated() {
    this.calcPaneInstances()
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/tabs';
</style>

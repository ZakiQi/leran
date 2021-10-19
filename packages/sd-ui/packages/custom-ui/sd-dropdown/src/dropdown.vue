<script>
import emitter from 'packages/utils/mixins/emitter'
import Clickoutside from 'packages/utils/clickoutside'

export default {
  name: 'sdDropdown',
  mixins: [emitter],
  directives: { Clickoutside },

  provide() {
    return {
      dropdown: this
    }
  },
  props: {
    modal: {
      type: Boolean,
      default: true
    },
    // placement: {
    //   type: String,
    //   default: 'bottom-end',
    // },
    // 触发下拉的行为
    trigger: {
      type: String,
      default: 'hover'
    },
    // 是否在点击菜单项后隐藏菜单
    hideOnClick: {
      type: Boolean,
      default: true
    },

    // 展开下拉菜单的延时（仅在 trigger 为 hover 时有效）
    showTimeout: {
      type: Number,
      default: 250
    },
    // 收起下拉菜单的延时（仅在 trigger 为 hover 时有效）
    hideTimeout: {
      type: Number,
      default: 150
    },
    tabindex: {
      type: Number,
      default: 0
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeout: null,
      visible: false,
      triggerElm: null,
      menuItems: null,
      menuItemsArray: null,
      dropdownElm: null,
      focusing: false,
      listId: `dropdown-menu-${Math.floor(Math.random() * 10000)}`
      // withoutHiddenClass: null,
      // bodyPaddingRight: null,
    }
  },
  watch: {
    visible(val) {
      // 通知子组件
      this.broadcast('sdDropdownMenu', 'visible', val)
      // visible-change	下拉框出现/隐藏时触发	出现则为 true，隐藏则为 false
      this.$emit('visible-change', val)
    }
  },
  mounted() {
    this.$on('menu-item-click', this.handleMenuItemClick)
  },
  methods: {
    // 显示
    show() {
      if (this.disabled) return
      clearTimeout(this.timeout)
      const showTimes = this.trigger === 'click' ? 0 : this.showTimeout
      this.timeout = setTimeout(() => {
        this.visible = true
      }, showTimes)
    },

    // 隐藏
    hide() {
      if (this.disabled) return
      this.removeTabindex()
      // todo 没懂这步骤
      if (this.tabindex >= 0) {
        this.resetTabindex(this.triggerElm)
      }
      clearTimeout(this.timeout)
      const hideTimes = this.trigger === 'click' ? 0 : this.hideTimeout
      this.timeout = setTimeout(() => {
        this.visible = false
      }, hideTimes)
    },

    // 点击
    handleClick() {
      if (this.disabled) return
      if (this.visible) {
        this.hide()
      } else {
        this.show()
      }
    },

    // 没懂
    resetTabindex(ele) {
      this.removeTabindex()
      ele.setAttribute('tabindex', '0') // 下次期望的聚焦元素
    },

    // 没懂
    removeTabindex() {
      this.triggerElm.setAttribute('tabindex', '-1')
      this.menuItemsArray.forEach((item) => {
        item.setAttribute('tabindex', '-1')
      })
    },

    initAria() {
      this.dropdownElm.setAttribute('id', this.listId)
      this.triggerElm.setAttribute('aria-haspopup', 'list')
      this.triggerElm.setAttribute('aria-controls', this.listId)
    },

    initEvent() {
      let { trigger, show, hide, handleClick } = this

      let dropdownElm = this.dropdownElm
      this.triggerElm = this.$slots.default[0].elm

      if (trigger === 'hover') {
        this.triggerElm.addEventListener('mouseenter', show)
        this.triggerElm.addEventListener('mouseleave', hide)
        dropdownElm.addEventListener('mouseenter', show)
        dropdownElm.addEventListener('mouseleave', hide)
      } else if (trigger === 'click') {
        this.triggerElm.addEventListener('click', handleClick)
      }
    },
    handleMenuItemClick(command, instance) {
      console.log(1111111111111111111)
      if (this.hideOnClick) {
        this.visible = false
      }
      this.$emit('command', command, instance)
    },

    initDomOperation() {
      this.dropdownElm = this.popperElm
      // this.dropdownElm = this.$slots.default[0].elm
      this.menuItems = this.dropdownElm.querySelectorAll("[tabindex='-1']")
      this.menuItemsArray = [].slice.call(this.menuItems)
      this.initEvent()
      this.initAria()
    }
  },

  render() {
    let { hide, disabled } = this
    let triggerElm = null
    triggerElm = this.$slots.default
    const menuElm = disabled ? null : this.$slots.dropdown

    // console.log('triggerElm', triggerElm)
    //
    // console.log('menuElm', menuElm)

    return (
      <div class='sd-dropdown' v-clickoutside={hide} aria-disabled={disabled}>
        {triggerElm}
        {menuElm}
      </div>
    )
  }
}
</script>

<style lang="scss">
@import '../../scss/dropdown';
</style>

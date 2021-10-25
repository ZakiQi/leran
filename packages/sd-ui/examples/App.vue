<template>
  <div id="app">
    <demo :nowThemeInfo="nowThemeInfo" @themeChange="themeChange"></demo>
    <!-- <div style="height: 1000px;"> -->
    <!-- <div class="test"> -->
    <!-- <sd-cascade-tip
          :options="cascadeTipData"
        ></sd-cascade-tip> -->

    <!-- <el-button size="mini" @click="sideDialogVisible = !sideDialogVisible">分享</el-button> -->
    <!-- 侧边栏 -->
    <!-- <sd-side-dialog  :visible.sync="sideDialogVisible" :direction="'right'" :width="400" :title="'分享'">
        </sd-side-dialog> -->

    <!--
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          :fullscreen="true"
          width="30%"
          :before-close="handleClose">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog> -->
    <!-- </div> -->
    <!--  -->

    <!--  -->

    <!-- <sd-date-picker
        v-model="value2"
        type="date"
        size="mini"
        :editable="false"
        style="margin-left: 10px;margin-right: 20px;"
        placeholder="选择日期">
      </sd-date-picker> -->

    <!-- <sd-transfer :value.sync="val" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer> -->
    <!-- <sd-transfer :value.sync="val1·" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer> -->
    <!-- </div> -->
  </div>
</template>

<script>
// import SdButton from '../packages/custom-ui/sd-button/sd-button.vue'
// import SdButton from '../packages/sd-button/sd-button.vue'
// import SdSideDialog from '../packages/sd-side-dialog/sd-side-dialog.vue'
import demo from './components/demo.vue'
export default {
  name: 'App',

  data() {
    return {
      val: [],
      val1: [],
      value2: '',
      separator: '-',
      inputValue: '',
      selectValue: '',
      monthValue: '',
      value1: '',
      endMonth: '',
      sideDialogVisible: false,
      selectOptions1: [
        {
          value: '从化',
          label: '从化'
        },
        {
          value: '天河',
          label: '天河'
        },
        {
          value: '黄埔',
          label: '黄埔'
        },
        {
          value: '海珠',
          label: '海珠'
        },
        {
          value: '越秀',
          label: '越秀'
        },
        {
          value: '南沙',
          label: '南沙'
        },
        {
          value: '荔湾',
          label: '荔湾'
        },
        {
          value: '白云',
          label: '白云'
        },
        {
          value: '增城',
          label: '增城'
        },
        {
          value: '东山',
          label: '东山'
        },
        {
          value: '花都',
          label: '花都'
        },
        {
          value: '番禺',
          label: '番禺'
        },
        {
          value: '其它',
          label: '其它'
        }
      ],
      cascadeTipData: [
        {
          name: '电信00123',
          msg: ['描述111111111111111', '描述222222222', '描述333333333333']
        },
        {
          name: '电信00232',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信003',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信004',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信00532232323',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信006',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信007',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信008',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信009',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信010',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信011',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信012',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信013',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信014',
          msg: ['描述1', '描述2', '描述3']
        },
        {
          name: '电信015撒测试的从是东方V大夫被覆盖把电饭锅把电饭锅',
          msg: ['描述1', '描述2', '描述3']
        }
      ],
      dialogVisible: false,
      flag: false,
      flag2: false,
      nowThemeInfo: 'linght-theme'
    }
  },

  watch: {},

  components: {
    demo
    // SdSideDialog,
    // SdButton
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },

    themeChange() {
      this.nowThemeInfo = this.nowThemeInfo === 'linght-theme' ? 'dark-theme' : 'linght-theme'
      this.setBodyAttr()
    },

    setBodyAttr() {
      document.body.setAttribute('data-theme', this.nowThemeInfo)
    }
  },

  mounted() {
    this.setBodyAttr()
  }
}
</script>

<style lang="scss">
@import '../assets/sass/theme/theme.scss';

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: $font-family;
  @include setAttr('background', 'bg-color');

  input,
  button {
    font-family: $font-family;
  }
}
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

.test {
  width: 700px;
}

.default .el-dialog.is-fullscreen {
  width: 300px !important;
}
</style>

<style>
/*v-enter 是进入之前，元素的起始状态*/
/*v-leave-to 离开之后动画的终止状态*/
.v-enter,
.v-leave-to {
  opacity: 0; /*透明度*/
  transform: translateX(150px);
}
/*入场(离场)动画的时间段   */
.v-enter-active,
.v-leave-active {
  transition: all 0.8s ease;
}

.my-enter,
.my-leave-to {
  opacity: 0; /*透明度*/
  transform: translateY(70px);
}
.my-enter-active,
.my-leave-active {
  transition: all 0.8s ease;
}
</style>

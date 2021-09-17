<template>
  <div id="app">
    <div style="height: 1000px;">
      <!-- <sd-button :type="'primary'" :title="'文字'" size="small">
        文字
      </sd-button> -->

      <!-- <sd-input v-model="inputValue" style=" width: 100px;margin: 10px;" size="mini" placeholder="请输入内容"></sd-input> -->

      <!-- <sd-select v-model="selectValue" size="mini" :options="selectOptions"></sd-select> -->
      <!-- <div class="test"> -->
        <sd-cascade-tip
          :options="cascadeTipData"
        ></sd-cascade-tip>

        <!-- <el-button size="mini" @click="sideDialogVisible = !sideDialogVisible">分享</el-button> -->
        <!-- 侧边栏 -->
        <!-- <sd-side-dialog  :visible.sync="sideDialogVisible" :direction="'right'" :width="400" :title="'分享'">
        </sd-side-dialog> -->

        <sd-button>
          22222
        </sd-button>

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
      <sd-date-picker
        v-model="endMonth"
        type="month"
        size="mini"
        value-format="yyyy-MM"
        :editable="false"
        style="width: 150px;margin-top: 5px;height: 26px;margin-right: 20px"
        placeholder="月份">
      </sd-date-picker>

      <!-- <sd-date-picker
        v-model="monthValue"
        type="monthrange"
        :range-separator="separator"
        size="mini"
        style="width:231px;margin-left: 10px;"
        value-format="yyyy-MM"
        start-placeholder="开始月份"
        end-placeholder="结束月份">
      </sd-date-picker>

      <sd-date-picker
        v-model="value1"
        type="daterange"
        range-separator="-"
        size="mini"
        style="width:231px;margin-left: 10px;"
        value-format="yyyy-MM"
        start-placeholder="开始月份"
        end-placeholder="结束月份">
      </sd-date-picker> -->

      <!-- <sd-date-picker
        v-model="value2"
        type="date"
        size="mini"
        :editable="false"
        style="margin-left: 10px;margin-right: 20px;"
        placeholder="选择日期">
      </sd-date-picker> -->

      <sd-transfer :value.sync="val" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer>
      <!-- <sd-transfer :value.sync="val1·" :options="selectOptions" style="margin: 10px 10px;width: 200px;display: inline-flex;"></sd-transfer> -->
    </div>
  </div>
</template>

<script>
// import SdButton from '../packages/sd-button/sd-button.vue'
// import SdSideDialog from '../packages/sd-side-dialog/sd-side-dialog.vue'
export default {
  name: "App",

  data () {
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
      selectOptions: [{
        value: '从化',
        label: '从化'
      }, {
        value: '天河',
        label: '天河'
      }, {
        value: '黄埔',
        label: '黄埔'
      }, {
        value: '海珠',
        label: '海珠'
      }, {
        value: '越秀',
        label: '越秀'
      }, {
        value: '南沙',
        label: '南沙'
      }, {
        value: '荔湾',
        label: '荔湾'
      }, {
        value: '白云',
        label: '白云'
      }, {
        value: '增城',
        label: '增城'
      }, {
        value: '东山',
        label: '东山'
      }, {
        value: '花都',
        label: '花都'
      }, {
        value: '番禺',
        label: '番禺'
      }, {
        value: '其它',
        label: '其它'
      }],
      selectOptions1: [{
        value: '从化',
        label: '从化'
      }, {
        value: '天河',
        label: '天河'
      }, {
        value: '黄埔',
        label: '黄埔'
      }, {
        value: '海珠',
        label: '海珠'
      }, {
        value: '越秀',
        label: '越秀'
      }, {
        value: '南沙',
        label: '南沙'
      }, {
        value: '荔湾',
        label: '荔湾'
      }, {
        value: '白云',
        label: '白云'
      }, {
        value: '增城',
        label: '增城'
      }, {
        value: '东山',
        label: '东山'
      }, {
        value: '花都',
        label: '花都'
      }, {
        value: '番禺',
        label: '番禺'
      }, {
        value: '其它',
        label: '其它'
      }],
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
      flag : false,
      flag2 : false,
    }
  },

  watch: {
    val (val) {
    },
    selectValue (val) {
    },

    inputValue (val) {
    }
  },

  components: {
    // SdSideDialog,
    // SdButton
  },

  methods: {
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(()=> {
            done();
          })
          .catch(()=> {});
      }
  },

  mounted () {
    this.$theme()
  }
}
</script>

<style lang="scss">
html, body{
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: $font-family;
  input, button{
    font-family: $font-family;
  }
}
#app {
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow: auto;
  box-sizing: border-box;
  // background: $primary-background;
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.test {
  width: 700px;
}

.default .el-dialog.is-fullscreen{
  width: 300px !important;
}
</style>

 <style>
    /*v-enter 是进入之前，元素的起始状态*/
    /*v-leave-to 离开之后动画的终止状态*/
    .v-enter,.v-leave-to{
        opacity:  0;/*透明度*/
        transform: translateX(150px);
    }
      /*入场(离场)动画的时间段   */
    .v-enter-active,.v-leave-active{
        transition: all 0.8s ease;

    }


    .my-enter,.my-leave-to{
        opacity:  0;/*透明度*/
        transform: translateY(70px);
    }
    .my-enter-active,.my-leave-active{
        transition: all 0.8s ease;

    }
</style>
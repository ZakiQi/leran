<template>
  <div
    style="
    text-align: left;
    padding: 20px;
    margin-top: 10px;"
  >
    <sd-button @click="dialogVisible = true">点击打开 dialog Form</sd-button>
    <sd-dialog title="新建文件夹" :visible.sync="dialogVisible" width="386px" :isShowIcon="false">
      <sd-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        labelPosition="top"
        size="mini"
        @submit.native.prevent
      >
        <sd-form-item label="看板名称：" prop="boardName">
          <sd-form-input
            type="text"
            v-model="form.boardName"
            maxlength="10"
            show-word-limit
            clearable
            placeholder="文本输入框"
          ></sd-form-input>
        </sd-form-item>

        <sd-form-item label="看板路径：" prop="selectValue">
          <treeselect
            v-model="form.selectValue"
            placeholder="根目录"
            :multiple="false"
            :noResultsText="'暂无选项'"
            :noOptionsText="'内容暂无'"
            :max-height="166"
            :options="selectOptions"
            @select="changeSelect"
            @input="inputChange"
          />
        </sd-form-item>

        <sd-form-item label="描述：" prop="textarea">
          <sd-form-input
            maxlength="200"
            show-word-limit
            type="textarea"
            :rows="8"
            resize="none"
            placeholder="请输入内容"
            v-model="form.textarea"
          />
        </sd-form-item>
      </sd-form>
      <span slot="footer" class="dialog-footer">
        <sd-button @click="aaa">重置</sd-button>
        <sd-button @click="dialogVisible = false">取消</sd-button>
        <sd-button type="primary" @click="a">确定</sd-button>
      </span>
    </sd-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import emitter from 'packages/utils/mixins/emitter'
import emitter from 'element-ui/src/mixins/emitter'
function checkFileName(rule, value, callback) {
  if (!value) {
    return callback(new Error('年龄不能为空'))
  }
  if (value < 18) {
    callback(new Error('必须年满18岁'))
  } else {
    callback()
  }
}

function generateData() {
  const data = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${i}`,
      disabled: i % 10 === 0
    })
  }
  return data
}

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        name1: '',
        age: ''
      },
      rules: {
        name1: [
          { required: true, message: '请输入活动名称1', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [{ required: true, validator: checkFileName, trigger: 'blur' }]
      },

      form: {
        boardName: '',
        textarea: '',
        selectValue: null
      },

      rules: {
        boardName: [{ required: true, message: '请输入活动名称1', trigger: 'blur' }],
        textarea: [{ required: true, message: '请输入活动名称1', trigger: 'blur' }],
        selectValue: [{ required: true, message: '请选择活动区域', trigger: 'change' }]
      },

      valuet: [1],
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        )
      },
      data: generateData(),
      isShare: true,
      leftCheckedAll: false,
      rightCheckedAll: false,
      selectValue: null,
      selectOptions: [
        {
          id: 'a',
          label: 'a',
          children: [
            {
              id: 'aa',
              label: 'aa'
            },
            {
              id: 'ab',
              label: 'ab'
            },
            {
              id: 'ac',
              label: 'ac'
            },
            {
              id: 'ad',
              label: 'ad'
            },
            {
              id: 'ae',
              label: 'ae'
            },
            {
              id: 'af',
              label: 'af'
            },
            {
              id: 'ag',
              label: 'ag'
            },
            {
              id: 'ah',
              label: 'ah'
            }
          ]
        },
        {
          id: 'b',
          label: 'b'
        },
        {
          id: 'c',
          label: 'c'
        }
      ]
    }
  },

  inject: {
    sdForm: {
      default: ''
    },
    sdFormItem: {
      default: ''
    }
  },

  mixins: [emitter],

  watch: {
    data: {
      handler: function(data) {
        this.countLength = data.length
      },

      immediate: true
    },
    'form.selectValue': {
      handler: function(val) {
        console.log('val')
        this.dispatch('sdFormItem', 'sd.form.change', [val])
      }
    },
    sdFormItem: function(val) {
      console.log('vvvvvv')
    }
  },
  methods: {
    a() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    aaa() {
      this.$refs['ruleForm'].resetFields()
    },
    changeSelect(a, b) {
      // this.dispatch('sdFormItem', 'sd.form.change', [a])
      this.$refs['ruleForm'].$emit('sd.form.change', a)
    },
    inputChange(a, b) {
      console.log('a', a)
      console.log('b', b)
      // this.$refs['ruleForm'].$emit('sd.form.blur', a)
      setTimeout(() => {
        this.$refs['ruleForm'].fields[1].validateState = 'success'
      }, 10)
      // this.dispatch('sdFormItem', 'sd.form.blur', [a])
    }
  },

  components: {
    Treeselect
  }
}
</script>

<style lang="scss" scoped></style>

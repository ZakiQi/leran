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
        label-width="80px"
        :rules="rules"
        labelPosition="right"
        size="mini"
      >
        <sd-form-item label="名称：" prop="age">
          <sd-form-input
            type="text"
            v-model="form.age"
            maxlength="10"
            show-word-limit
            clearable
            placeholder="文本输入框"
          ></sd-form-input>
        </sd-form-item>

        <!-- <sd-form-item label="名称：" prop="age">
          <sd-form-input
            type="text"
            v-model="form.age"
            maxlength="10"
            show-word-limit
            clearable
            placeholder="文本输入框"
          ></sd-form-input>
        </sd-form-item> -->
      </sd-form>
      <span slot="footer" class="dialog-footer">
        <sd-button
          icon="iconfont sd-icon-folderfolder-3"
          type="primary"
          @click="dialogVisible = false"
          >新建文件夹</sd-button
        >
        <sd-button icon="iconfont sd-icon-add" type="primary" @click="dialogVisible = false"
          >新建看板</sd-button
        >
      </span>
    </sd-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      if (value < 18) {
        callback(new Error('必须年满18岁'))
      } else {
        callback()
      }
    }
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
        age: [{ required: true, validator: checkAge, trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

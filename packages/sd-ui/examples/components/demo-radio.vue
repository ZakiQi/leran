<template>
  <div
    style="
    text-align: left;
    padding: 20px;
    margin-top: 10px;"
  >
    <sd-form-radio-group v-model="radio">
      <sd-form-radio :label="1">备选项1</sd-form-radio>
      <sd-form-radio :label="2">备选项2</sd-form-radio>
    </sd-form-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: 1
    }
  }
}
</script>

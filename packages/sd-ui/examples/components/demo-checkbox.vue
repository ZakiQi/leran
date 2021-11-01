<template>
  <div
    style="
    text-align: left;
    padding: 20px;
    margin-top: 10px;"
  >
    <sd-form-checkbox v-model="checked">内容区域</sd-form-checkbox>
    <div style="margin: 15px 0;"></div>

    <sd-form-checkbox-group v-model="checkList">
      <sd-form-checkbox label="复选框 A"></sd-form-checkbox>
      <sd-form-checkbox label="复选框 B"></sd-form-checkbox>
      <sd-form-checkbox label="禁用" disabled></sd-form-checkbox>
      <sd-form-checkbox label="选中且禁用" disabled></sd-form-checkbox>
    </sd-form-checkbox-group>

    <div style="margin: 15px 0;"></div>

    <sd-form-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</sd-form-checkbox
    >
    <div style="margin: 8px 0;"></div>
    <sd-form-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <sd-form-checkbox v-for="city in cities" :label="city" :key="city">{{
        city
      }}</sd-form-checkbox>
    </sd-form-checkbox-group>
  </div>
</template>

<script>
const cityOptions = ['上海', '北京', '广州', '深圳']

export default {
  data() {
    return {
      checked: true,
      checkList: ['选中且禁用', '复选框 A'],

      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      console.log('111', val)
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },

    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      console.log('checkedCount', checkedCount)
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style lang="scss" scoped></style>

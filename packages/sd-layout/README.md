# `@sd-timesdata/sd-layout`

> 时代layout组件，带拖拽

## Usage

```
 <chartsGridLayout 
  :layout="layout"
  :draggable="true"
  :resizable="true"
>
  <!-- 图表内容 组件内部暴露妹个layout的index和每格代表的高度-->
  <template slot-scope="{chartsIndex, rowHeight}">
      ...
  </template>
</chartsGridLayout>
```

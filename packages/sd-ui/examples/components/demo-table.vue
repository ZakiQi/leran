<template>
  <div
    style="
    padding: 20px;"
  >
    <sd-table :data="tableData" style="width: 100%">
      <sd-table-column label="名称" prop="name" align="left" width="900">
        <template slot-scope="scope">
          <div class="wrap" style="width: 850px;">
            <i
              class="iconfont"
              :class="[
                { ' placeholder': scope.row.folder },
                !scope.row.folder && scope.row.collect
                  ? 'collect-nor1 sd-icon-collect-nor1'
                  : 'collect-nor1 sd-icon-collect-sel1'
              ]"
            ></i>
            <template v-if="!scope.row.folder">
              <div class="pic">
                <img
                  style="width:36px; height: 36px;"
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.bdstatic.com%2F94o3dSag_xI4khGkpoWK1HF6hhy%2Fbaike%2Fc0%253Dbaike180%252C5%252C5%252C180%252C60%2Fsign%3D02b5f9ac728b4710da22f59ea2a7a898%2Fd833c895d143ad4b6907474d82025aafa40f0615.jpg&refer=http%3A%2F%2Fgss0.bdstatic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636511149&t=ceb46f923b9f4bd2f3d0513cce165592"
                />
              </div>
            </template>
            <template v-else>
              <!-- <i class="iconfont sd-icon-selfolder-sel selfolder-sel"></i> -->
              <!-- <icon-svg
                icon-class="sd-icon-selfolder-sel"
                style="height: 46px;
                flex: 0 0 46px;"
              /> -->
            </template>
            <span v-tooltip.top.ellipsis="scope.row.name" class="text">{{ scope.row.name }}</span>
          </div>
        </template>
      </sd-table-column>
      <sd-table-column label="创作时间" prop="startTime" align="left"> </sd-table-column>
      <sd-table-column label="修改时间" prop="updateTime" align="left">
        <template slot-scope="scope">{{ scope.row.updateTime || '-' }}</template>
      </sd-table-column>
      <sd-table-column align="right" width="165">
        <template slot="header">
          <div class="header-header">
            <span>操作</span>

            <sd-dropdown trigger="click">
              <!-- <span class="sd-dropdown-link"> 下拉菜单<i class="sd-icon-arrow-down sd-icon--right"></i> </span> -->
              <!-- <i
                  style="padding: 0; margin-right: 0"
                  class="iconfont sd-icon-normore-smal handle-item"
                  v-tooltip.top="'更多操作'"
                ></i> -->

              <sd-tooltip content="更多操作" placement="top-end" offset="-15">
                <!-- <i style="padding: 0; margin-right: 0" class="iconfont sd-icon-normore-smal handle-item"></i> -->

                <i class="iconfont sd-icon-a-1-nor1 handle-item handleColor"></i>
              </sd-tooltip>

              <sd-dropdown-menu slot="dropdown" placement="left-end" offset="-125">
                <!-- sd-icon-select -->
                <sd-dropdown-item command="copy"
                  ><i class="iconfont sd-icon-select"></i> 全部</sd-dropdown-item
                >
                <sd-dropdown-item command="move">移动到</sd-dropdown-item>
                <sd-dropdown-item>刷新缓存</sd-dropdown-item>
                <sd-dropdown-item command="delete">删除</sd-dropdown-item>
              </sd-dropdown-menu>
            </sd-dropdown>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="handle-wrap">
            <template v-if="!scope.row.folder">
              <sd-tooltip content="编辑" placement="top" offset="7">
                <i class="iconfont handleColor  handle-item handleColor">&#xe658;</i>
              </sd-tooltip>

              <sd-tooltip content="分享" placement="top">
                <i
                  class="iconfont handleColor handle-item handleColor"
                  @click="drawerVisible = true"
                  >&#xe624;</i
                >
              </sd-tooltip>

              <sd-dropdown trigger="click" style="margin-left: 15px">
                <!-- <span class="sd-dropdown-link"> 下拉菜单<i class="sd-icon-arrow-down sd-icon--right"></i> </span> -->
                <!-- <i
                  style="padding: 0; margin-right: 0"
                  class="iconfont sd-icon-normore-smal handle-item"
                  v-tooltip.top="'更多操作'"
                ></i> -->

                <sd-tooltip content="更多操作" placement="top-end" offset="-15">
                  <!-- <i style="padding: 0; margin-right: 0" class="iconfont sd-icon-normore-smal handle-item"></i> -->

                  <i
                    style="padding: 0; margin-right: 0"
                    class="iconfont sd-icon-normore-smal handle-item handleColor"
                  ></i>
                </sd-tooltip>

                <sd-dropdown-menu slot="dropdown" placement="bottom" offset="-3000">
                  <sd-dropdown-item icon="sd-icon-copy" command="copy">复制看板</sd-dropdown-item>
                  <sd-dropdown-item icon="sd-icon-move" command="move">移动到</sd-dropdown-item>
                  <sd-dropdown-item icon="sd-icon-a-01-nor">刷新缓存</sd-dropdown-item>
                  <sd-dropdown-item icon="sd-icon-a-1-nor3" command="delete">删除</sd-dropdown-item>
                </sd-dropdown-menu>
              </sd-dropdown>
            </template>

            <template v-else>
              <sd-tooltip content="编辑" placement="top" offset="7">
                <i class="iconfont  handle-item handleColor">&#xe65a;</i>
              </sd-tooltip>
              <sd-tooltip content="删除" placement="top" offset="0">
                <i class="iconfont  handle-item handleColor">&#xe65b;</i>
              </sd-tooltip>
            </template>
          </div>
        </template>
      </sd-table-column>
    </sd-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          folder: true,
          collect: false,
          startTime: '2021/8/31 12:09:09',
          updateTime: '2021/9/7 12:09:09',
          name:
            '套用模型省时省力，不用冥思苦想，但是，每一个需要设计的内容和体系应该是迥然不同的。数据人平台'
        },
        {
          folder: true,
          collect: false,
          startTime: '2021/8/31 12:09:09',
          updateTime: '2021/9/7 12:09:09',
          name: '套用模型省时省力，不用冥思苦想'
        },
        {
          folder: false,
          collect: true,
          startTime: '2021/8/31 12:09:09',
          updateTime: '2021/9/7 12:09:09',
          name: '应该是迥然不同的。数据人平台'
        },
        {
          folder: false,
          collect: false,
          startTime: '2021/8/31 12:09:09',
          updateTime: '2021/9/7 12:09:09',
          name: '套用模型省时省力，不用冥思苦想，但是，每一个需要设计的内容和体系应该是迥然'
        },
        {
          folder: false,
          collect: true,
          startTime: '2021/8/31 12:09:09',
          updateTime: '',
          name: '应该是迥然不同的。数据人平台'
        },
        {
          folder: false,
          collect: false,
          startTime: '2021/8/31 12:09:09',
          updateTime: '',
          name: '套用模型省时省力，不用冥思苦想，但是，每一个需要设计的内容和体系应该是迥然'
        },
        {
          folder: false,
          collect: false,
          startTime: '2021/8/31 12:09:09',
          updateTime: '',
          name: '套用模型省时省力，不用冥思苦想，但是，每一个需要设计的内容和体系应该是迥然'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  color: #262626;

  .placeholder {
    margin-right: 15px;
    &::before {
      content: '';
      width: 16px;
      height: 16px;
      display: inline-block;
    }
  }
  & .selfolder-sel {
    font-size: 46px;
    color: #0077ff;
  }
  & .collect-nor1 {
    margin-right: 15px;
    color: #8c8c8c;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  & .sd-icon-collect-sel1 {
    color: #7c6909;
  }
  & span {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    font-size: 14px;
    margin-left: 12px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .activate {
    color: red;
  }
}

.header-header {
  span {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #595959;
    margin-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.handle-wrap {
  .handle-item {
    cursor: pointer;
    padding: 0 15px;
  }
  .handle-item:nth-child(1) {
    padding-left: 0;
  }
  .handle-item:last-child {
    // padding-right: 0;
    margin-right: -15px;
  }
}

.sd-table {
  .sd-table__body-wrapper {
    .wrap {
      .text {
        &:hover {
          color: #0077ff;
        }
      }
    }
  }
}

.pic {
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

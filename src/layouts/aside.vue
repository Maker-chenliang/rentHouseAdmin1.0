<template>
  <div class="aside-inner">
    <div class="logo-bar">
      <el-image class="logo-img" :src="logoUrl" fit="contain">
        <template #error>
          <el-icon class="logo-fallback">
            <Failed />
          </el-icon>
        </template>
      </el-image>
      <span v-show="!isCollapse" class="logo-text">后台管理</span>
    </div>

    <el-menu :router="true" :default-active="route.path" class="el-menu-vertical-demo" :collapse="isCollapse"
      @open="handleOpen" @close="handleClose">

      <el-menu-item index="/index">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <template #title>
          <span>首页</span>
        </template>
      </el-menu-item>

      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <span>公寓管理</span>
        </template>

        <el-menu-item index="/apartmentManagent/apartmentManagement">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <template #title>
            <span>公寓管理</span>
          </template>
        </el-menu-item>

        <el-menu-item index="2-2">
          <el-icon>
            <Key />
          </el-icon>
          <template #title>
            <span>房间管理</span>
          </template>
        </el-menu-item>

        <el-menu-item index="2-3">
          <el-icon>
            <Operation />
          </el-icon>
          <template #title>
            <span>属性管理</span>
          </template>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="3" disabled>
        <el-icon>
          <document />
        </el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon>
          <setting />
        </el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import {
  Document,
  Failed,
  HomeFilled,
  House,
  Key,
  Location,
  Menu as IconMenu,
  OfficeBuilding,
  Operation,
  Setting,
} from '@element-plus/icons-vue'
import logoUrl from '@/assets/icons/logo3.png'
import { useRoute } from 'vue-router';
const route = useRoute()

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style>
/* el-menu 自带 border-right，但它只画在菜单自身高度上（展开 400px / 折叠后更矮），
   跟 .layout-aside 那条整屏的线对不齐，看着像断断续续的虚线。统一清掉，只留 aside 那条。
   选择器抬到 .el-menu.el-menu-vertical-demo 是为了压过 EP 的 .el-menu 默认值 */
.el-menu.el-menu-vertical-demo {
  border-right: none;
}

/* 宽度交给 .layout-aside 的 :width 统一控制，这里撑满就行，
   免得两处各写一个数字、改一处忘一处 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
}
</style>

<style scoped>
.aside-inner {
  display: flex;
  flex-direction: column;
  height: 100%;

}

.logo-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  height: 60px;
  padding: 0 16px;
  overflow: hidden;
  white-space: nowrap;
}

/* 折叠态 aside 是 64px，左右各 16px padding 后正好剩 32px，logo 居中 */
.logo-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-fallback {
  font-size: 32px;
  color: var(--el-text-color-placeholder);
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>

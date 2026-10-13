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

    <el-menu :router="true" :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse"
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

        <el-menu-item index="/apartmentManagement/apartmentManagement">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <template #title>
            <span>公寓管理</span>
          </template>
        </el-menu-item>

        <el-menu-item index="/apartmentManagement/roomManagement">
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
import { computed } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()

// 当前该点亮哪一项菜单。
// 为什么不直接用 route.path：像编辑公寓这种二级页面根本不在菜单里，
// 完整路径跟任何 index 都对不上，菜单会整块失去高亮、分组还会自动收起来。
// 所以路由的 meta 里可以标一个 activeMenu，指明「这个页面属于哪一项菜单」，
// 有标就用它，没标就退回完整路径。
// route.meta 是响应式的（useRoute() 拿到的是响应式对象），
// 外面套 computed，跳转时 default-active 才会跟着变
const activeIndex = computed(() => route.meta.activeMenu ?? route.path)

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  }
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

/* 选中那一项的蓝底。为什么要写成这样：
   1. .el-menu-item 是 el-menu 内部渲染出来的，不在本组件的模板里，
      加了 scoped 属性之后裸写选择器匹配不到，必须用 :deep() 钻进去；
   2. :deep() 展开后是 .aside-inner[data-v-x] .el-menu-item.is-active（四个类），
      优先级压得过 EP 那条 hover 规则 .el-menu-item:not(.is-disabled):hover
      （三个类），所以鼠标划过选中项时蓝底不会被 hover 的浅灰顶掉。
   底色本身定义在 index.vue 的 .layout-aside 里，跟其它配色放一起 */
.aside-inner :deep(.el-menu-item.is-active) {
  background-color: var(--aside-active-bg);
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
  /* 圆形。.logo-img 挂在 el-image 的根元素上，而 EP 的 .el-image 自带
     overflow: hidden，所以这一个圆角就能把里面的 <img> 和 #error 插槽一起裁圆，
     不用再去 :deep 内层的 .el-image__inner */
  border-radius: 50%;

}

.logo-fallback {
  font-size: 32px;
  color: var(--el-text-color-placeholder);
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  /* 原来取 --el-text-color-primary（近黑），换成深色侧边栏后等于隐形。
     --aside-text-color 由 index.vue 的 .layout-aside 定义，
     CSS 变量会继承，这里直接取得到 —— 深色底的文字色只有那一个来源 */
  color: var(--aside-text-color);
}
</style>

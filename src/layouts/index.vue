<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="layout-aside" :width="isCollapse ? '64px' : '18%'">
        <Aside :is-collapse="isCollapse"></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header :is-collapse="isCollapse" @toggle="toggleCollapse"></Header>
        </el-header>
        <el-main class="layout-main">
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Aside from './aside.vue';
import Header from './header.vue';

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 监听窗口宽度
const screenWidth = ref(window.innerWidth)

const handleResize = () => {
  screenWidth.value = window.innerWidth
}
// 第二个参数必须是函数。原来传的 screenWidth 是个 ref 对象（不是函数），
// 浏览器会抛 TypeError，监听器压根没注册上 → screenWidth.value 永远不变 → watch 不触发
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(screenWidth, (newVal) => {
  isCollapse.value = newVal < 800
}, { immediate: true })


</script>
<style scoped>
/* 跟 el-menu 的 .vertical-collapse-transition 用同一条曲线，否则 aside 先缩完、
   菜单还在慢慢缩，中间那 0.3s 菜单比 aside 宽，撞上 el-aside 自带的 overflow: auto
   就会闪一条横向滚动条 */
.layout-aside {
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid var(--el-border-color);
  transition: width var(--el-transition-duration) ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.common-layout {
  height: 100vh;
  overflow: hidden;
}

.common-layout>.el-container {
  height: 100%;
}

/* el-main 默认不带背景色（element-plus 的 .el-main 只有 padding/flex/overflow），
   白色是 body 透上来的。换成页面灰底，home.vue 里那张白卡片才能浮出来 */
.layout-main {
  background-color: var(--el-bg-color-page);
  overflow-y: auto;
}
</style>

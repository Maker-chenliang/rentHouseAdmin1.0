<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="layout-aside" :width="isCollapse ? '64px' : '15%'">
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

const asideBackGround = ref("rgb(0, 21, 41)")

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
  isCollapse.value = newVal < 1000
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

  /* 直接写 background-color: asideBackGround; 是无效值 —— CSS 不认识 JS 的 ref，
     解析器遇到解析不了的值会把整条声明丢掉，而且不报错，所以看着像「没生效」。
     v-bind() 才是 JS 变量进 CSS 的入口：编译后在组件根元素上挂一个
     --xxxx-asideBackGround 的行内 CSS 变量，这里再把它取出来用 */
  background-color: v-bind(asideBackGround);

  /* el-menu 自带 background-color: var(--el-menu-bg-color)，默认是白色
     （--el-fill-color-blank），会把上面这层深色整片盖住，只在菜单下方露出一条。
     这套 --el-menu-* 变量 EP 声明在 :root 上，.el-menu 只负责消费，
     所以在祖先节点重写就能生效 —— 就近继承到的值赢过 :root。
     设成 transparent 让 aside 的底色透上来，配色只由 asideBackGround 一处决定 */
  --el-menu-bg-color: transparent;
  /* 菜单文字默认取 --el-text-color-primary（#303133，近黑），深底上等于隐形 */
  --el-menu-text-color: rgba(255, 255, 255, 0.75);
  --el-menu-hover-text-color: #fff;
  --el-menu-active-color: #fff;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.08);

  /* logo 那行在 aside.vue 里面，够不着上面这些变量。
     单独开一个给它，深色底的文字色还是只有这一个来源 */
  --aside-text-color: rgba(255, 255, 255, 0.9);

  /* 选中那一项的蓝底。EP 的 .el-menu-item.is-active 只设了 color，没给任何
     background-color，所以蓝底得自己补一条规则 —— 在 aside.vue 里，
     因为它要盖的是 el-menu 内部渲染出来的元素 */
  --aside-active-bg: var(--el-color-primary);
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

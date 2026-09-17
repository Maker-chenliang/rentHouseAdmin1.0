<template>
  <div class="top">
    <el-image class="top-logo" :src="logoUrl" fit="contain">
      <template #error>
        <el-icon class="top-logo-fallback">
          <Failed />
        </el-icon>
      </template>
    </el-image>

    <div class="top-info">
      <p class="top-greeting">{{ greeting }}，今天你也要开心哦</p>
      <p class="top-time">{{ now }}</p>
    </div>
  </div>



</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Failed } from '@element-plus/icons-vue'
import logoUrl from '@/assets/icons/logo3.png'

const now = ref('')
const greeting = ref('')

let timer = null

const pad = (n) => String(n).padStart(2, '0')

const getGreeting = (hour) => {
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

const tick = () => {
  const d = new Date()
  now.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  greeting.value = getGreeting(d.getHours())
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.top-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
}

.top-logo-fallback {
  font-size: 56px;
  color: var(--el-text-color-placeholder);
}

.top-greeting {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.top-time {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>

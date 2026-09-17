<template>
  <div class="container">
    <el-icon class="toggle-icon" @click="emit('toggle')">
      <Expand v-if="isCollapse" />
      <Fold v-else />
    </el-icon>
  </div>
</template>
<script setup>
import {
  Expand,
  Fold,
} from '@element-plus/icons-vue'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])
</script>
<style scoped>
.container {
  display: flex;
  align-items: center;
  height: 100%;

}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

.toggle-icon:hover {
  color: var(--el-color-primary);
}
</style>

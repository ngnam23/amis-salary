<template>
  <aside class="w-[235px] h-full">
    <div class="p-[15px] h-full">
      <div class="flex flex-col gap-y-1">
        <div
          v-for="item in SIDEBAR_MENU"
          v-tooltip="{ value: item.name, showDelay: 100 }"
          :key="item.name"
          :class="[
            'sidebar flex items-center gap-2 bg-transparent h-8 px-[15px] rounded-[8px] cursor-pointer hover:bg-e9e',
            item.route === '/salarycomposition' ? 'active' : '',
          ]"
        >
          <div :class="[item.icon, item.route === '/salarycomposition' ? 'active' : '']"></div>
          <span class="text-left">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { SIDEBAR_MENU } from '@/constants/common'
</script>

<style scoped lang="scss">
.sidebar {
  &.active {
    background-color: #e6f5ef;
    color: var(--primary-color);
  }
}
</style>

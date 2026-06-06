<template>
  <header class="h-12 flex items-center justify-between bg-primary">
    <div class="ml-1.5 flex items-center">
      <div
        class="w-9 h-9 flex items-center justify-center mr-1.5 hover:bg-eff rounded-full cursor-pointer"
      >
        <div class="icon-ninedot-white"></div>
      </div>
      <RouterLink to="/">
        <div class="flex items-center">
          <div class="w-8 h-auto cursor-pointer">
            <img src="@/assets/svgs/icon-payroll-logo.svg" alt="logo" class="w-full h-full" />
          </div>
          <span class="text-white text-[18px] font-bold ml-3">Tiền lương</span>
        </div>
      </RouterLink>
    </div>
    <div class="flex items-center mr-4">
      <div class="input-wrap mr-4">
        <div class="icon-search-white absolute left-2.5 top-1/2 -translate-y-1/2"></div>
        <input
          type="text"
          class="pr-2 pl-10 border-none outline-none w-full h-full bg-transparent"
          placeholder="Tìm kiếm"
        />
      </div>
      <div class="flex items-center">
        <div class="flex items-center gap-3">
          <div
            v-for="item in navItems"
            v-tooltip.bottom="{ value: item.label, showDelay: 100 }"
            :key="item.label"
            class="flex items-center justify-center w-9 h-9 hover:bg-001a rounded-full cursor-pointer"
          >
            <div class="" :class="item.icon"></div>
          </div>
        </div>
        <div class="ml-4">
          <img
            src="@/assets/svgs/avatar.svg"
            alt="avatar"
            class="w-8 h-8 rounded-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const navItems = [
  {
    label: 'Thiết lập',
    icon: 'icon-setting-white',
  },
  {
    label: 'Tính năng mới',
    icon: 'icon-new-feature-white',
  },
  {
    label: 'Tin nhắn',
    icon: 'icon-message-white',
  },
  {
    label: 'Thông báo',
    icon: 'icon-notification-white',
  },
  {
    label: 'Trợ giúp',
    icon: 'icon-help-white',
  },
  {
    label: 'Tính năng khác',
    icon: 'icon-more-white',
  },
]
</script>

<style scoped lang="scss">
.input-wrap {
  position: relative;
  border-radius: 8px;
  background: #fff3;
  color: #fffc;
  width: 300px;
  height: 32px;

  & input::placeholder {
    color: #ffffffb3;
    font-size: 13px;
  }
}
</style>

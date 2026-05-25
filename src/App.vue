<script setup>
import Toast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <Toast />
  <ConfirmPopup group="popup" />
  <ConfirmDialog group="confirm-dialog" class="custom-dialog">
    <template #container="{ message, acceptCallback, rejectCallback, closeCallback }">
      <div class="px-6 pb-6 pt-4 rounded-[8px] w-[415px]">
        <div class="pb-3 flex items-center justify-between">
          <span class="!text-[16px] !text-[#101828] !font-bold">{{ message.header }}</span>
          <div
            class="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-[#E9EAEB] cursor-pointer"
            @click="closeCallback"
          >
            <div class="pi pi-times" style="font-size: 12px"></div>
          </div>
        </div>
        <div class="flex items-center pb-4">
          <span class="flex-1 text-[#101828] font-normal">{{ message.message }}</span>
        </div>

        <div class="flex justify-end gap-x-2">
          <button
            @click="rejectCallback"
            :class="[
              'min-w-[80px] !h-[32px] !px-3 !text-[13px] !bg-white border border-[#D5D7DA] hover:!bg-[#E9EAEB] !rounded-[8px] !text-[#101828]',
              message.rejectClass,
            ]"
          >
            {{ message.rejectLabel }}
          </button>
          <button
            @click="acceptCallback"
            :class="[
              'min-w-[80px] !h-[32px] !px-3 !text-white !text-[13px] !bg-[#0E9A62] hover:!bg-[#0A724B] !rounded-[8px]',
              message.acceptClass,
            ]"
          >
            {{ message.acceptLabel }}
          </button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
  <RouterView />
</template>

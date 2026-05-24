<template>
  <div class="flex items-center">
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnPrev && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('prevStartPage')"
    >
      <div class="pi pi-angle-double-left" style="font-size: 15px; color: #717680"></div>
    </div>
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnPrev && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('prevPage')"
    >
      <div class="pi pi-angle-left" style="font-size: 15px; color: #717680"></div>
    </div>
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnNext && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('nextPage')"
    >
      <div class="pi pi-angle-right" style="font-size: 15px; color: #717680"></div>
    </div>
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnNext && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('nextEndPage')"
    >
      <div class="pi pi-angle-double-right" style="font-size: 15px; color: #717680"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  disableBtnPrev: {
    type: Boolean,
    default: true,
  },
  disableBtnNext: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['prevStartPage', 'prevPage', 'nextPage', 'nextEndPage'])
</script>

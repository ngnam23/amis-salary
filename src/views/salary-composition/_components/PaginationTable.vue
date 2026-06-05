<template>
  <div class="flex items-center">
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnPrev && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('prevStartPage')"
    >
      <img src="@/assets/svgs/icon-arrow-left-start.svg" class="w-4 h-4" />
    </div>
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnPrev && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('prevPage')"
    >
      <img src="@/assets/svgs/icon-arrow-left.svg" class="w-4 h-4" />
    </div>
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnNext && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('nextPage')"
    >
      <img src="@/assets/svgs/icon-arrow-right.svg" class="w-4 h-4" />
    </div>
    <div
      class="py-1 px-2 rounded-full hover:bg-d3d cursor-pointer"
      :class="[disableBtnNext && 'opacity-30 !cursor-not-allowed hover:!bg-transparent']"
      @click="$emit('nextEndPage')"
    >
      <img src="@/assets/svgs/icon-arrow-right-end.svg" class="w-4 h-4" />
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

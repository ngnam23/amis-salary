<template>
  <button
    type="button"
    class="h-8 rounded-[8px] flex justify-center items-center gap-x-2 px-3 text-[#101828] bg-white border border-[#D5D7DA] hover:bg-[#E9EAEB]"
    @click="handleClick"
  >
    <i v-if="icon" :class="[icon, 'text-[#afb3c1]']"></i>
    <slot v-else />
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: String,
  icon: String,
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<script setup>
import { Select } from 'primevue'
import { useField } from 'vee-validate'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'key',
  },
  placeholder: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const { value, errorMessage, handleBlur } = useField(() => props.name)
</script>

<template>
  <div class="w-full flex flex-col gap-y-1">
    <Select
      v-model="value"
      :options="options"
      :option-value="optionValue"
      :option-label="optionLabel"
      :placeholder="placeholder"
      :disabled="disabled"
      class="!h-8 !rounded-[8px] !text-[13px] font-normal hover:!border-[#0E9A62] focus:!border-[#0E9A62]"
      @blur="handleBlur"
      :class="[
        errorMessage && ' hover:!border-[#f7453b] focus:!border-[#f7453b]',
        errorMessage ? '!border-[#f7453b]' : '!border-[#D5D7DA]',
        disabled && 'hover:!border-[#D5D7DA] focus:!border-none !bg-[#f5f5f5] cursor-not-allowed',
      ]"
    />
    <p v-if="errorMessage" class="text-xs text-[#f7453b] font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>

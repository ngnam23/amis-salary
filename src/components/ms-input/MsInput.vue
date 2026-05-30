<script setup>
import { InputText } from 'primevue'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const { value, errorMessage, handleBlur } = useField(props.name)
</script>

<template>
  <div class="flex flex-col gap-y-1 w-full">
    <InputText
      :type="type"
      v-model="value"
      class="!h-8 !rounded-[8px] !text-[13px] font-normal hover:!border-[#0E9A62] focus:!border-[#0E9A62] placeholder:!text-[#9e9e9e]"
      @blur="handleBlur"
      :placeholder="placeholder"
      :class="[
        errorMessage && ' hover:!border-[#f7453b] focus:!border-[#f7453b]',
        errorMessage ? '!border-[#f7453b]' : '!border-[#D5D7DA]',
      ]"
    />

    <p v-if="errorMessage" class="text-xs text-[#f7453b] font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>

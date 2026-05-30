<script setup>
import Textarea from 'primevue/textarea'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const { value, handleBlur } = useField(() => props.name)
</script>

<template>
  <Textarea
    v-model="value"
    :placeholder="placeholder"
    class="!h-[86px] w-full !rounded-[8px] hover:!border-[#0E9A62] !text-[13px] font-normal placeholder:!text-[#9e9e9e]"
    @blur="handleBlur"
  />
</template>

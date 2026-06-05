<script setup>
import { Select } from 'primevue'

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
})
</script>

<template>
  <Select
    :options="options"
    :option-value="optionValue"
    :option-label="optionLabel"
    :placeholder="placeholder"
  />
</template>

<style>
.p-select {
  height: 32px;
  border-radius: 8px;
}
.p-select .p-select-label {
  display: flex;
  align-items: center;
  font-size: 13px !important;
}
.p-select-list {
  padding-left: 0 !important;
  padding-right: 0 !important;
  gap: 0 !important;
}
.p-select-option.p-select-option-selected {
  background-color: #cdeadf !important;
  color: #0e9a62 !important;
  font-weight: 500 !important;
}
.p-select-option {
  border-radius: 0 !important;
}
.p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
  background-color: #e9eaeb !important;
}
.p-icon {
  width: 12px;
  height: 12px;
}
</style>

<template>
  <div class="page-size-select" ref="selectRef">
    <button
      class="select-trigger"
      :class="{ open: isOpen, 'drop-up': dropUp }"
      type="button"
      @click="toggleDropdown"
    >
      <span class="select-trigger-text"
        ><span class="text-[#717680]">{{ prefixLabel }}{{ ' ' }}</span>
        <span class="font-semibold">{{ selectedLabel }}</span></span
      >
      <div class="select-arrow">
        <div class="icon-chevron-down"></div>
      </div>
    </button>

    <Transition :name="dropUp ? 'dropdown-up' : 'dropdown'">
      <div v-if="isOpen" ref="dropdownRef" class="select-dropdown" :class="{ 'drop-up': dropUp }">
        <ul class="select-options">
          <li
            v-for="option in options"
            :key="option.value"
            class="select-option"
            :class="{ selected: option.value === modelValue }"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: -1,
  },
  options: {
    type: Array,
    default: () => [],
  },
  prefixLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropUp = ref(false)
const selectRef = ref(null)
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue)
  return found ? found.label : ''
})

function calculatePosition() {
  if (!selectRef.value) return
  const triggerRect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value?.scrollHeight ?? 260
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top
  dropUp.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => calculatePosition())
  }
}

function selectOption(value) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.page-size-select {
  position: relative;
  display: inline-block;
  font-size: 13px;
  font-weight: normal;
  min-width: fit-content;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding-left: 12px;
  background-color: #fff;
  border: 1px solid #d5d7da;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: border-color 0.2s;
}

.select-trigger:hover {
  background-color: #e9eaeb;
}

.select-trigger.open {
  border-color: #d5d7da;
}

.select-trigger-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  margin-right: 4px;
  width: 30px;
  height: 100%;
  transition: transform 0.2s ease;
}

.select-arrow .icon.open {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  border-radius: 8px;
  max-height: 260px;
  overflow-y: auto;
  padding: 8px 0;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1000000015);
}

.select-dropdown.drop-up {
  top: auto;
  bottom: calc(100% + 2px);
}

.select-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.select-option {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 26px;
  padding: 0 12px;
  cursor: pointer;
  border-radius: 4px;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.select-option:hover {
  background-color: #e9eaeb;
}

.select-option.selected {
  background-color: #cdeadf;
  color: #0e9a62;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: bottom;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
</style>

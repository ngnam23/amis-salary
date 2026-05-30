<script setup>
import { ref, nextTick } from 'vue'
import http from '@/utils/http'
import { Select } from 'primevue'
import { useField } from 'vee-validate'
import { listApi } from '@/constants/list-api'

const props = defineProps({
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

const pageIndex = ref(1)
const pageSize = ref(20)
const options = ref([])
const isLoading = ref(false)
const hasMore = ref(true)

// Create a unique class name for this instance's overlay to target it in the DOM
const uniqueId = `select-overlay-${Math.random().toString(36).substring(2, 9)}`

const getData = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await http.get(listApi.SalaryCompositionsPaging, {
      params: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value,
      },
    })
    if (response.isSuccess) {
      const fetchedData =
        response.data.data.map((item) => ({
          ...item,
          salaryCompositionLabel: `${item.salaryCompositionName} (${item.salaryCompositionCode})`,
        })) || []

      if (pageIndex.value === 1) {
        // Keep currently selected option if it exists and is not present in first-page data
        const selectedVal = value.value
        const selectedOption = options.value.find((opt) => opt[props.optionValue] === selectedVal)

        options.value = fetchedData

        if (selectedOption && !fetchedData.some((opt) => opt[props.optionValue] === selectedVal)) {
          options.value.unshift(selectedOption)
        }
      } else {
        options.value.push(...fetchedData)
      }

      // If we got fewer items than pageSize, we reached the end of list
      if (fetchedData.length < pageSize.value) {
        hasMore.value = false
      } else {
        hasMore.value = true
      }
    }
  } catch (error) {
    console.error('Error fetching list:', error)
  } finally {
    isLoading.value = false
  }
}

const handleScroll = (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target
  // When scrolled near the bottom, load more items
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMore()
  }
}

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  pageIndex.value++
  await getData()
}

const onShow = async () => {
  pageIndex.value = 1
  hasMore.value = true
  await getData()

  nextTick(() => {
    const overlay = document.querySelector(`.${uniqueId}`)
    if (overlay) {
      const scrollContainer = overlay.querySelector('.p-select-list-container')
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll)
      }
    }
  })
}

const onHide = () => {
  const overlay = document.querySelector(`.${uniqueId}`)
  if (overlay) {
    const scrollContainer = overlay.querySelector('.p-select-list-container')
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }
}
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
      :overlay-class="uniqueId"
      @show="onShow"
      @hide="onHide"
      @blur="handleBlur"
      :class="[
        errorMessage && ' hover:!border-[#f7453b] focus:!border-[#f7453b]',
        errorMessage ? '!border-[#f7453b]' : '!border-[#D5D7DA]',
      ]"
    >
      <template #footer>
        <div
          v-if="isLoading"
          class="p-2 text-center text-xs text-[#0E9A62] font-medium flex items-center justify-center gap-1 border-t border-[#D5D7DA]/10"
        >
          <i class="pi pi-spin pi-spinner text-xs"></i> Đang tải thêm...
        </div>
      </template>
    </Select>
    <p v-if="errorMessage" class="text-xs text-[#f7453b] font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>

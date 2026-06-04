<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButtonBase from '@/components/ms-button/MsButtonBase.vue'
import MsSelectOption from '@/components/ms-select-option/MsSelectOption.vue'
import { PAGE_SIZE_OPTIONS } from '@/constants/common'
import PaginationTable from '@/views/salary-composition/_components/PaginationTable.vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import MsSelect from '@/components/ms-select/MsSelect.vue'
import { useSalarySystemTable } from '@/composables/useSalarySystemTable'

const activeTypeSelectOptions = [
  { value: -1, label: 'Tất cả' },
  { value: 1, label: 'Thông tin nhân viên' },
  { value: 2, label: 'Chấm công' },
  { value: 3, label: 'Doanh số' },
  { value: 4, label: 'KPI' },
  { value: 5, label: 'Sản phẩm' },
  { value: 6, label: 'Lương' },
  { value: 7, label: 'Thuế TNCN' },
  { value: 8, label: 'Bảo hiểm - Công đoàn' },
  { value: 9, label: 'Khác' },
]

const {
  rows,
  totalItems,
  pageIndex,
  pageSize,
  keyword,
  compositionType,
  fields,
  isLoading,
  getData,
  debounceGetData,
} = useSalarySystemTable()

const indexStart = computed(() => (totalItems.value ? (pageIndex.value - 1) * pageSize.value : -1))
const indexEnd = computed(() =>
  pageIndex.value * pageSize.value > totalItems.value
    ? totalItems.value
    : pageIndex.value * pageSize.value,
)

const disableBtnPrev = computed(() => {
  return !indexStart.value || !rows.value.length
})
const disableBtnNext = computed(() => {
  return pageIndex.value * pageSize.value >= totalItems.value
})

const handlePrevStartPage = () => {
  if (!disableBtnPrev.value) {
    pageIndex.value = 1
  }
}

const handlePrevPage = () => {
  if (!disableBtnPrev.value) {
    pageIndex.value -= 1
  }
}

const handleNextEndPage = () => {
  if (!disableBtnNext.value) {
    pageIndex.value = Math.ceil(totalItems.value / pageSize.value)
  }
}

const handleNextPage = () => {
  if (!disableBtnNext.value) {
    pageIndex.value += 1
  }
}

// const isOpenCustomColumnDrawer = ref(false)

const selectedIdsArray = ref([])

/**
 * Cập nhật danh sách các ID được chọn trong bảng
 * @param {Array} selectedIds - Mảng chứa các ID
 */
const handleSelectedIds = (selectedIds) => {
  selectedIdsArray.value = selectedIds
}

const resetSelectedIds = () => {
  selectedIdsArray.value = []
}

watch(
  [pageIndex, compositionType],
  () => {
    getData()
  },
  { deep: true },
)

watch(pageSize, () => {
  if (pageIndex.value === 1) {
    getData()
  } else {
    pageIndex.value = 1
  }
})

watch(keyword, () => {
  debounceGetData()
})

onMounted(() => {
  nextTick(() => {
    getData()
  })
})
</script>

<template>
  <div class="w-[calc(100%-235px)] bg-[#f1f2f1] pt-3 px-4 pb-4">
    <div class="w-full h-full">
      <div class="flex items-center pb-[14px]">
        <div
          class="w-9 h-9 mr-2 rounded-full flex items-center justify-center hover:bg-[#dadce3] cursor-pointer"
          @click="$router.push('/salarycomposition')"
        >
          <div class="icon-arrow-left"></div>
        </div>
        <h2 class="text-[20px] font-bold">Danh mục thành phần lương của hệ thống</h2>
      </div>
      <div class="flex flex-col items-center h-[calc(100%-46px)]">
        <div class="w-full h-[56px] py-3 px-4 bg-white relative rounded-t-[8px]">
          <div class="flex justify-between items-center h-full">
            <div class="flex items-center gap-x-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="keyword"
                  placeholder="Tìm kiếm"
                  class="!h-8 !rounded-[8px] !text-[13px] font-normal hover:!border-[#0E9A62] focus:!border-[#0E9A62] placeholder:!text-[#9e9e9e]"
                />
              </IconField>
              <div v-if="selectedIdsArray.length <= 0" class="flex items-center gap-x-2">
                <MsSelect
                  v-model="compositionType"
                  :options="activeTypeSelectOptions"
                  prefix-label="Loại thành phần:"
                />
              </div>
              <div v-else class="flex items-center gap-x-4">
                <div class="flex items-center gap-x-4">
                  <span class="font-normal"
                    >Đã chọn <span class="font-bold">{{ selectedIdsArray.length }}</span></span
                  >
                  <p class="text-[#34b057] font-normal cursor-pointer" @click="resetSelectedIds">
                    Bỏ chọn
                  </p>
                </div>
                <div class="flex items-center gap-x-2">
                  <MsButtonBase label="Đưa vào danh sách sử dụng">
                    <div class="icon-plus"></div>
                  </MsButtonBase>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 w-full overflow-x-auto">
          <div class="min-w-full h-full overflow-x-auto">
            <div class="h-[calc(100%-48px)] overflow-y-auto bg-white">
              <ms-table
                :fields="fields.filter((field) => field.display)"
                :rows="rows"
                :isLoading="isLoading"
                :selected-ids="selectedIdsArray"
                key-field="salaryCompositionId"
                @update-selected-ids="handleSelectedIds"
              >
              </ms-table>
            </div>
            <div
              class="flex items-center px-4 justify-between h-12 bg-white rounded-b-[8px] border-t border-[#D5D7DA]"
            >
              <span class="font-normal"
                >Tổng số: <span class="font-bold">{{ totalItems }}</span></span
              >
              <div class="flex items-center gap-x-4">
                <span class="font-normal">Số dòng/trang</span>
                <MsSelectOption v-model="pageSize" :options="PAGE_SIZE_OPTIONS" />
                <p>{{ indexStart + 1 }} - {{ indexEnd }}</p>
                <PaginationTable
                  :indexStart="indexStart"
                  :indexEnd="indexEnd"
                  :disableBtnPrev="disableBtnPrev"
                  :disableBtnNext="disableBtnNext"
                  @prevStartPage="handlePrevStartPage"
                  @prevPage="handlePrevPage"
                  @nextPage="handleNextPage"
                  @nextEndPage="handleNextEndPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

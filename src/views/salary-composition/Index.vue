<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButtonBase from '@/components/ms-button/MsButtonBase.vue'
import { useSalaryTable } from '@/composables/useSalaryTable'
import MsSelectOption from '@/components/ms-select-option/MsSelectOption.vue'
import { PAGE_SIZE_OPTIONS } from '@/constants/common'
import PaginationTable from './_components/PaginationTable.vue'

const listActionHead = [
  { label: 'Lấy lại dữ liệu', icon: 'icon-refresh', type: 'refresh' },
  { label: 'Xuất ra Excel', icon: 'icon-excel', type: 'export' },
  { label: 'Tùy chỉnh giao diện', icon: 'icon-setting', type: 'setting' },
]

const batchActionOptions = [
  { label: 'Xóa hàng loạt', value: 'deleteAll' },
  { label: 'Sử dụng hàng loạt', value: 'activeAll' },
  { label: 'Ngừng sử dụng hàng loạt', value: 'unActiveAll' },
]

/**
 * Lấy danh sách các tùy chọn hành động cho từng dòng dữ liệu trong bảng
 * @param {Object} row - Đối tượng dữ liệu của một nhân viên
 */
const getRowOptions = (row) => [
  { label: 'Nhân bản', value: 'double' },
  { label: 'Xóa', value: 'delete' },
  { label: row.isActive ? 'Ngừng sử dụng' : 'Sử dụng', value: 'toggleStatus' },
]

const {
  rows,
  totalItems,
  pageIndex,
  pageSize,
  keyword,
  isActive,
  fields,
  isLoading,
  getData,
  debounceGetData,
} = useSalaryTable()

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

const isOpenCustomColumnDrawer = ref(false)

const selectedIdsArray = ref([])
const actionHeadIndex = ref(null)

/**
 * Cập nhật danh sách các ID nhân viên đang được chọn trong bảng
 * @param {Array} selectedIds - Mảng chứa các ID nhân viên
 */
const handleSelectedIds = (selectedIds) => {
  selectedIdsArray.value = selectedIds
}

watch(
  [pageIndex, isActive],
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
    <div class="flex justify-between pb-[14px]">
      <h2 class="text-[20px] font-bold">Thành phần lương</h2>
      <div class="flex gap-x-3">
        <MsButtonBase label="Danh mục của hệ thống"> <div class="icon-rule"></div> </MsButtonBase>
        <div class="flex items-center">
          <div
            class="flex items-center justify-center gap-x-2 w-[88px] h-8 px-3 bg-[#0E9A62] border border-[#0E9A62] text-white !mr-0 rounded-l-[8px] hover:bg-[#0A724B] cursor-pointer"
          >
            <div class="icon-plus-white"></div>
            Thêm
          </div>
          <div class="flex items-center h-8 w-[1px] bg-primary">
            <div class="h-5 w-[1px] bg-white"></div>
          </div>
          <div
            class="flex items-center justify-center gap-x-2 w-8 h-8 bg-[#0E9A62] border border-[#0E9A62] text-white !ml-0 rounded-r-[8px] hover:bg-[#0A724B] cursor-pointer"
          >
            <div class="icon-chevron-down-white"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center h-[calc(100%-46px)]">
      <div class="w-full h-[56px] py-3 px-4 bg-white relative rounded-t-[8px]"></div>
      <div class="flex-1 w-full overflow-x-auto">
        <div class="min-w-full h-full overflow-x-auto">
          <div class="h-[calc(100%-48px)] overflow-y-auto">
            <ms-table
              :fields="fields.filter((field) => field.display)"
              :rows="rows"
              :isLoading="isLoading"
              key-field="salaryCompositionId"
              @update-selected-ids="handleSelectedIds"
            >
              <template #action="{ row }">
                <div class="flex items-center gap-x-2 justify-center px-3">
                  <div
                    class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                  >
                    <div
                      :class="row.isActive ? 'icon-circle-minus-yellow' : 'icon-circle-check-green'"
                    ></div>
                  </div>
                  <div
                    class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                  >
                    <div class="icon-copy"></div>
                  </div>
                  <div
                    class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                  >
                    <div class="icon-pencil"></div>
                  </div>
                  <div
                    class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                  >
                    <div class="icon-trash-red"></div>
                  </div>
                </div>
              </template>
            </ms-table>
          </div>
          <div class="flex items-center px-4 justify-between h-12 bg-white rounded-b-[8px]">
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
</template>

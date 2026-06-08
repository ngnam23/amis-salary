<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import MsTable from '@/components/ms-table/MsTable.vue'
import MsButtonBase from '@/components/ms-button/MsButtonBase.vue'
import { useSalaryTable } from '@/composables/useSalaryTable'
import MsSelectOption from '@/components/ms-select-option/MsSelectOption.vue'
import { PAGE_SIZE_OPTIONS } from '@/constants/common'
import PaginationTable from './_components/PaginationTable.vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import MsSelect from '@/components/ms-select/MsSelect.vue'
import { useSalaryActions } from '@/composables/useSalaryActions'
import { useSalaryCompositionGrid } from '@/composables/useSalaryCompositionGrid'
import SalaryCompositionGrid from './_components/SalaryCompositionGrid.vue'
import UnitDropdownBox from './_components/UnitDropdownBox.vue'

const batchActionOptions = [
  {
    label: 'Ngừng theo dõi',
    value: 'unActiveAll',
    icon: 'icon-circle-minus-yellow',
    class: 'text-[#f90] border-[#FF9900] hover:bg-[#FEF0C7] hover:border-[#DC6803]',
  },
  {
    label: 'Đang theo dõi',
    value: 'activeAll',
    icon: 'icon-circle-check-green',
    class: 'text-[#34b057] !border-[#34b057] hover:bg-[#A8D9C8] hover:border-[#0A724B]',
  },
  {
    label: 'Xóa',
    value: 'deleteAll',
    icon: 'icon-trash-red',
    class: 'text-[#F04438] border-[#F04438] hover:bg-[#FEE4E2] hover:border-[#D92D20]',
  },
]

const activeTypeSelectOptions = [
  { label: 'Tất cả', value: -1 },
  { label: 'Đang sử dụng', value: 1 },
  { label: 'Ngừng sử dụng', value: 0 },
]

const {
  rows,
  totalItems,
  pageIndex,
  pageSize,
  keyword,
  isActive,
  selectedOrganizationIds,
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

const {
  isOpenSalaryCompositionGrid,
  type,
  salaryCompositionDetail,
  handleOpenCreate,
  handleSaveAndAdd,
  handleOpenToUpdate,
  handleOpenToDouble,
  handleOpenToDetail,
} = useSalaryCompositionGrid()

const { handleActionAll, handleRowSelect, showConfirm, handleDeleteSalaryComposition } =
  useSalaryActions(
    rows,
    selectedIdsArray,
    getData,
    resetSelectedIds,
    handleOpenToUpdate,
    handleOpenToDouble,
  )

const handleMoreDelete = (detail) => {
  showConfirm(
    `Bạn có chắc chắn muốn xóa thành phần lương ${detail.salaryCompositionName} không?`,
    () => {
      const isSuccess = handleDeleteSalaryComposition([detail.salaryCompositionId])
      if (isSuccess) {
        isOpenSalaryCompositionGrid.value = false
      }
    },
    'Thông báo',
    'Xóa',
    'Hủy',
    '!bg-[#F04438] !border-[#F04438] hover:!bg-[#D92D20]',
    '',
  )
}

watch(
  [pageIndex, isActive, selectedOrganizationIds],
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

/**
 * Xử lý sự kiện nhấn phím tắt hệ thống
 * @param {KeyboardEvent} event - Đối tượng sự kiện phím
 */
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === '1') {
    event.preventDefault()
    handleOpenCreate()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  nextTick(() => {
    getData()
  })
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="w-[calc(100%-235px)] bg-[#f1f2f1] pt-3 px-4 pb-4">
    <div v-if="!isOpenSalaryCompositionGrid" class="w-full h-full">
      <div class="flex justify-between pb-[14px]">
        <h2 class="text-[20px] font-bold">Thành phần lương</h2>
        <div class="flex gap-x-3">
          <MsButtonBase
            label="Danh mục của hệ thống"
            @click="$router.push('/salary-composition/system-category')"
          >
            <div class="icon-rule"></div>
          </MsButtonBase>
          <div class="flex items-center">
            <div
              v-tooltip.bottom="{ value: 'Thêm (Ctrl + 1)', showDelay: 100 }"
              class="flex items-center justify-center gap-x-2 w-[88px] h-8 px-3 bg-[#0E9A62] border border-[#0E9A62] text-white !mr-0 rounded-l-[8px] hover:bg-[#0A724B] cursor-pointer"
              @click="handleOpenCreate"
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
        <div class="w-full h-[56px] py-3 px-4 bg-white relative rounded-t-[8px]">
          <div class="flex justify-between items-center h-full">
            <div class="flex items-center gap-x-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="keyword"
                  placeholder="Tìm kiếm"
                  class="min-w-[300px] !h-8 !rounded-[8px] !text-[13px] font-normal hover:!border-[#0E9A62] focus:!border-[#0E9A62] placeholder:!text-[#9e9e9e]"
                />
              </IconField>
              <div v-if="selectedIdsArray.length <= 0" class="flex items-center gap-x-2">
                <MsSelect
                  v-model="isActive"
                  :options="activeTypeSelectOptions"
                  prefix-label="Trạng thái:"
                />
                <UnitDropdownBox v-model="selectedOrganizationIds" />
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
                  <MsButtonBase
                    v-for="item in batchActionOptions"
                    :key="item.value"
                    :label="item.label"
                    :class="item.class"
                    @click="() => handleActionAll(item)"
                  >
                    <div :class="item.icon"></div>
                  </MsButtonBase>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-x-2">
              <MsButtonBase v-tooltip.bottom="{ value: 'Bộ lọc', showDelay: 100 }" class="w-8 !p-0">
                <div class="icon-filter"></div>
              </MsButtonBase>
              <MsButtonBase
                v-tooltip.bottom="{ value: 'Thiết lập', showDelay: 100 }"
                class="w-8 !p-0"
              >
                <div class="icon-setting"></div>
              </MsButtonBase>
            </div>
          </div>
        </div>
        <div class="flex-1 w-full overflow-x-auto">
          <div class="min-w-full h-full overflow-x-auto">
            <div
              :class="[
                'relative h-[calc(100%-48px)] bg-white',
                rows.length ? 'overflow-y-auto' : 'overflow-hidden',
              ]"
            >
              <ms-table
                :fields="fields.filter((field) => field.display)"
                :rows="rows"
                :isLoading="isLoading"
                :selected-ids="selectedIdsArray"
                key-field="salaryCompositionId"
                @update-selected-ids="handleSelectedIds"
                @row-click="(row) => handleOpenToDetail(row.salaryCompositionId)"
              >
                <template #action="{ row }">
                  <div class="flex items-center gap-x-2 justify-center px-3">
                    <div
                      :title="row.isActive ? 'Ngừng theo dõi' : 'Đang theo dõi'"
                      class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                      @click="() => handleRowSelect('toggleStatus', row)"
                    >
                      <div
                        :class="
                          row.isActive ? 'icon-circle-minus-yellow' : 'icon-circle-check-green'
                        "
                      ></div>
                    </div>
                    <div
                      title="Nhân bản"
                      class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                      @click="() => handleRowSelect('double', row)"
                    >
                      <div class="icon-copy"></div>
                    </div>
                    <div
                      title="Sửa"
                      class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                      @click="() => handleRowSelect('update', row)"
                    >
                      <div class="icon-pencil"></div>
                    </div>
                    <div
                      title="Xóa"
                      class="w-7 h-7 rounded-[8px] bg-white border border-[#D5D7DA] flex items-center justify-center hover:bg-[#E9EAEB]"
                      @click="() => handleRowSelect('delete', row)"
                    >
                      <div class="icon-trash-red"></div>
                    </div>
                  </div>
                </template>
              </ms-table>
              <div
                v-if="!rows.length && !isLoading"
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
              >
                <div class="ms-table__icon_nodata"></div>
                <div class="mt-4 font-normal">Không có dữ liệu</div>
              </div>
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
    <SalaryCompositionGrid
      v-if="isOpenSalaryCompositionGrid"
      :salary-composition-detail="salaryCompositionDetail"
      :type="type"
      :isOpen="isOpenSalaryCompositionGrid"
      @close="isOpenSalaryCompositionGrid = false"
      @refresh="getData"
      @confirm="handleSaveAndAdd"
      @more-double="(id) => handleOpenToDouble(id)"
      @more-delete="handleMoreDelete"
    />
  </div>
</template>

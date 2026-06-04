<template>
  <table class="ms-table">
    <thead class="sticky top-0 left-0 right-0 z-30">
      <tr class="">
        <th
          class="!w-[50px] h-9 sticky left-0 z-20 bg-[#f5f5f5] border-b border-t border-[#D5D7DA]"
        >
          <div class="flex justify-center items-center">
            <Checkbox v-model="selectedAll" binary size="small" @change="handleSelectAll" />
          </div>
        </th>
        <th
          v-for="field in fields"
          :key="field.key"
          class="text-[13px] bg-[#f5f5f5] px-3 border-b border-r border-t border-[#D5D7DA]"
          :style="{ width: `${field.width}px`, textAlign: 'left' }"
        >
          <span class="!truncate font-semibold">{{ field.label }}</span>
        </th>
        <th class="w-[200px] h-9 px-3 bg-[#f5f5f5] border-l border-b border-t border-[#D5D7DA]">
          <div class="flex items-center justify-end"></div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.salaryCompositionId"
        class="relative group bg-white"
        @click="emit('rowClick', row)"
      >
        <td class="!w-[50px] h-9 sticky left-0 z-20 bg-white border-b border-[#D5D7DA]" @click.stop>
          <div class="flex justify-center items-center">
            <Checkbox
              v-model="localSelectedIds"
              :value="row.salaryCompositionId"
              size="small"
              @change="handleRowSelect"
            />
          </div>
        </td>
        <td
          v-for="field in fields"
          :key="field.key"
          class="px-3 font-normal bg-white border-b border-[#D5D7DA]"
          :style="{ width: `${field.width}px`, textAlign: 'left' }"
        >
          <template v-if="field.key === 'compositionType'">
            <span class="!truncate line-clamp-1">{{
              CompositionType.find((item) => item.key === row[field.key])?.label
            }}</span>
          </template>
          <template v-else-if="field.key === 'compositionNature'">
            <span class="!truncate line-clamp-1">{{
              CompositionNature.find((item) => item.key === row[field.key])?.label
            }}</span>
          </template>
          <template v-else-if="field.key === 'taxable'">
            <span class="!truncate line-clamp-1">{{
              row['compositionNature'] === 1
                ? Taxable.find((item) => item.key === row[field.key])?.label
                : '-'
            }}</span>
          </template>
          <template v-else-if="field.key === 'isTaxDeductions'">
            <span class="!truncate line-clamp-1">{{
              row['compositionNature'] === 2 ? (row[field.key] ? 'Có' : 'Không') : '-'
            }}</span>
          </template>
          <template v-else-if="field.key === 'valueType'">
            <span class="!truncate line-clamp-1">{{
              ValueType.find((item) => item.key === row[field.key])?.label
            }}</span>
          </template>
          <template v-else-if="field.key === 'optionShowPaycheck'">
            <span class="!truncate line-clamp-1">{{
              OptionShowPaycheck.find((item) => item.key === row[field.key])?.label
            }}</span>
          </template>
          <template v-else-if="field.key === 'generatingSource'">
            <span class="!truncate line-clamp-1">Tự thêm </span>
          </template>
          <template v-else-if="field.key === 'isActive'">
            <div class="flex items-center justify-start">
              <div
                v-if="row[field.key]"
                class="bg-[#edfcf4] border border-[#75e0ac] text-primary py-[2px] px-2 rounded-[8px] flex items-center gap-x-[6px]"
              >
                <span class="bg-[#0E9A62] w-[6px] h-[6px] rounded-full"></span>
                <span>Đang theo dõi</span>
              </div>
              <div
                v-else
                class="bg-[#fffaeb] border border-[#fedf89] text-[#dc6803] py-[2px] px-2 rounded-[8px] flex items-center gap-x-[6px]"
              >
                <span class="bg-[#f79009] w-[6px] h-[6px] rounded-full"></span>
                <span>Ngừng theo dõi</span>
              </div>
            </div>
          </template>
          <template v-else-if="field.key === 'organizationIds'">
            <span class="!truncate line-clamp-1">{{ row.organizationName }}</span>
          </template>
          <template v-else>
            <span class="!truncate line-clamp-1">{{ row[field.key] }}</span>
          </template>
        </td>
        <td
          class="w-[200px] h-8 sticky right-0 z-20 bg-transparent border-b border-[#D5D7DA] pointer-events-none group-hover:pointer-events-auto group-hover:bg-transparent"
          @click.stop
        >
          <div class="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
            <slot name="action" :row="row"></slot>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import {
  CompositionNature,
  CompositionType,
  OptionShowPaycheck,
  Taxable,
  ValueType,
} from '@/constants/common'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  keyField: {
    type: String,
    default: 'id',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  selectedIds: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['updateSelectedIds', 'rowClick'])

const localSelectedIds = ref([])
const selectedAll = ref(false)

watch(
  () => props.rows,
  () => {
    selectedAll.value = false
    localSelectedIds.value = []
    emit('updateSelectedIds', [])
  },
  { deep: true },
)

watch(
  () => props.selectedIds,
  (newVal) => {
    localSelectedIds.value = newVal || []
    selectedAll.value = props.rows.length > 0 && localSelectedIds.value.length === props.rows.length
  },
  { deep: true, immediate: true },
)

const handleSelectAll = () => {
  if (selectedAll.value) {
    localSelectedIds.value = props.rows.map((row) => row[props.keyField])
  } else {
    localSelectedIds.value = []
  }
  emit('updateSelectedIds', localSelectedIds.value)
}

const handleRowSelect = () => {
  selectedAll.value = localSelectedIds.value.length === props.rows.length
  emit('updateSelectedIds', localSelectedIds.value)
}
</script>

<style scoped>
.ms-table {
  position: relative;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
}
tr:hover th {
  cursor: pointer;
}
tr:hover,
tr:hover td {
  cursor: pointer;
  background-color: #cdeadf;
}
</style>

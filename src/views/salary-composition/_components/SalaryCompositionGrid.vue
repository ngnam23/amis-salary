<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between h-9 mb-[14px]">
      <div class="flex items-center">
        <div
          class="w-9 h-9 mr-2 rounded-full flex items-center justify-center hover:bg-[#dadce3] cursor-pointer"
          @click="$emit('close')"
        >
          <div class="icon-arrow-left"></div>
        </div>
        <h2 class="text-[20px] font-bold">
          {{
            props.type === 'update' || props.type === 'detail'
              ? `${props.salaryCompositionDetail?.salaryCompositionName}`
              : 'Thêm thành phần'
          }}
        </h2>
      </div>
      <div v-if="type === 'update'" class="flex items-center gap-2">
        <MsButtonBase label="Hủy bỏ" class="w-20" />
        <MsButtonBase
          label="Lưu"
          class="w-20 !bg-[#0E9A62] text-white !border-[#0E9A62] hover:!bg-[#0A724B]"
          @click="handleSave"
        />
        <div class="card flex justify-center">
          <Button
            type="button"
            icon="pi pi-ellipsis-h"
            @click="toggleMoreAction"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            class="!h-8 !rounded-[8px] !flex !justify-center !items-center !px-3 !text-[#101828] !bg-white !border !border-[#D5D7DA] hover:!bg-[#E9EAEB]"
          />
          <Menu ref="menuMore" id="overlay_menu" :model="items" :popup="true">
            <template #item="{ item }">
              <div
                class="h-8 px-3 flex items-center gap-x-2 rounded-[4px] hover:bg-[#E9EAEB] cursor-pointer"
              >
                <div :class="item.icon"></div>
                <span class="text-[#101828] font-normal">{{ item.label }}</span>
              </div>
            </template>
          </Menu>
        </div>
      </div>
    </div>
    <div class="w-full flex-1 overflow-y-hidden">
      <div
        :class="[
          'bg-white overflow-y-auto rounded-[6px] p-10',
          type === 'create' || type === 'double' ? 'h-[calc(100%-44px)]' : 'h-full',
        ]"
      >
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Tên thành phần <span class="text-[red]">*</span></p>
          </div>
          <div class="col-span-10">
            <MsInput v-if="type !== 'detail'" name="salaryCompositionName" />
            <div
              v-else
              class="group flex items-center h-9 justify-between border-b border-[#e3e5ee]"
            >
              <p class="flex flex-1 items-center w-full font-normal pl-2">
                <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{
                  props.salaryCompositionDetail?.salaryCompositionName
                }}</span>
              </p>
              <div
                class="group-hover:flex hidden w-9 h-9 rounded-full items-center justify-center hover:bg-[#0000001a] cursor-pointer"
              >
                <div class="icon-pencil"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Mã thành phần <span class="text-[red]">*</span></p>
          </div>
          <div class="col-span-10">
            <MsInput
              v-if="type !== 'detail'"
              name="salaryCompositionCode"
              placeholder="Nhập mã viết liền"
            />
            <div
              v-else
              class="group flex items-center h-9 justify-between border-b border-[#e3e5ee]"
            >
              <p class="flex flex-1 items-center w-full font-normal pl-2">
                <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{
                  props.salaryCompositionDetail?.salaryCompositionCode
                }}</span>
              </p>
              <div
                class="group-hover:flex hidden w-9 h-9 rounded-full items-center justify-center hover:bg-[#0000001a] cursor-pointer"
              >
                <div class="icon-pencil"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Đơn vị áp dụng<span class="text-[red]">*</span></p>
          </div>
          <div class="col-span-10">
            <UnitDropdownBox v-if="type !== 'detail'" name="selectedOrganizationIds" />
            <div
              v-else
              class="group flex items-center h-9 justify-between border-b border-[#e3e5ee]"
            >
              <p class="flex flex-1 items-center w-full font-normal pl-2">
                <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{
                  props.salaryCompositionDetail?.organizationName
                }}</span>
              </p>
              <div
                class="group-hover:flex hidden w-9 h-9 rounded-full items-center justify-center hover:bg-[#0000001a] cursor-pointer"
              >
                <div class="icon-pencil"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Loại thành phần<span class="text-[red]">*</span></p>
          </div>
          <div class="col-span-3">
            <MsSelectControl
              v-if="type !== 'detail'"
              name="compositionType"
              :options="CompositionType"
              class="w-full"
            />
            <div
              v-else
              class="group flex items-center h-9 justify-between border-b border-[#e3e5ee]"
            >
              <p class="flex flex-1 items-center w-full font-normal pl-2">
                <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{
                  CompositionType[props.salaryCompositionDetail?.compositionType - 1]?.label
                }}</span>
              </p>
              <div
                class="group-hover:flex hidden w-9 h-9 rounded-full items-center justify-center hover:bg-[#0000001a] cursor-pointer"
              >
                <div class="icon-pencil"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Tính chất<span class="text-[red]">*</span></p>
          </div>
          <div class="col-span-3">
            <MsSelectControl
              v-if="type !== 'detail'"
              name="compositionNature"
              :options="CompositionNature"
              class="w-full"
            />
            <div
              v-else
              class="group flex items-center h-9 justify-between border-b border-[#e3e5ee]"
            >
              <p class="flex flex-1 items-center w-full font-normal pl-2">
                <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{
                  CompositionNature[props.salaryCompositionDetail?.compositionNature - 1]?.label
                }}</span>
              </p>
              <div
                class="group-hover:flex hidden w-9 h-9 rounded-full items-center justify-center hover:bg-[#0000001a] cursor-pointer"
              >
                <div class="icon-pencil"></div>
              </div>
            </div>
          </div>
          <div class="col-span-7 ml-4">
            <div v-if="values.compositionNature === 1" class="flex items-center gap-x-4 h-8">
              <MsRadioControl label="Chịu thuế" id="taxable_1" name="taxable" :value="1" />
              <MsRadioControl
                label="Miễn thuế toàn phần"
                id="taxable_2"
                name="taxable"
                :value="2"
              />
              <MsRadioControl label="Miễn thuế một phần" id="taxable_3" name="taxable" :value="3" />
            </div>
            <div v-else-if="values.compositionNature === 2" class="flex items-center gap-x-4 h-8">
              <MsCheckbox
                name="isTaxDeductions"
                id="isTaxDeductions"
                label="Giảm trừ khi tính thuế"
              />
            </div>
          </div>
        </div>
        <div v-if="values.compositionNature < 3" class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Định mức</p>
          </div>
          <div class="col-span-10">
            <MsTextarea name="norms" placeholder="Tự động gợi ý công thức và tham số khi gõ" />
          </div>
        </div>
        <div v-if="values.compositionNature < 3" class="grid grid-cols-12 mb-4">
          <div class="col-span-2"></div>
          <div class="col-span-10">
            <MsCheckbox
              name="isOverNorms"
              id="isOverNorms"
              label="Cho phép giá trị tính vượt quá định mức"
            />
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Kiểu giá trị</p>
          </div>
          <div class="col-span-3">
            <MsSelectControl
              name="valueType"
              :options="ValueType"
              :disabled="values.compositionNature < 3"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Giá trị</p>
          </div>
          <div class="col-span-10">
            <div class="flex flex-col w-full gap-y-2.5">
              <div class="flex flex-col gap-y-2.5">
                <MsRadioControl
                  label="Tự động cộng tổng giá trị của các nhân viên"
                  id="valueCalculationType_1"
                  name="valueCalculationType"
                  :value="1"
                />
                <div class="grid grid-cols-12 gap-2">
                  <div class="col-span-5">
                    <MsSelectControl
                      :disabled="values.valueCalculationType === 2"
                      name="sumScope"
                      :options="SumScope"
                      class="w-full"
                    />
                  </div>
                  <div
                    v-if="values.valueCalculationType === 1 && values.sumScope === 3"
                    class="col-span-2"
                  >
                    <MsSelectControl
                      name="autoSumOrgLevel"
                      :options="AutoSumOrgLevel"
                      class="w-full"
                    />
                  </div>
                  <div
                    v-if="values.valueCalculationType === 1"
                    :class="[
                      values.valueCalculationType === 1 && values.sumScope === 3
                        ? 'col-span-5'
                        : 'col-span-7',
                    ]"
                  >
                    <SelectRelatedComposition
                      name="relatedCompositionId"
                      option-value="salaryCompositionId"
                      option-label="salaryCompositionLabel"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-y-4">
                <MsRadioControl
                  label="Tính theo công thức tự đặt"
                  id="valueCalculationType_2"
                  name="valueCalculationType"
                  :value="2"
                />
                <MsTextarea
                  v-if="values.valueCalculationType === 2"
                  name="formula"
                  placeholder="Tự động gợi ý công thức và tham số khi gõ"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Mô tả</p>
          </div>
          <div class="col-span-10">
            <MsTextarea name="description" />
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Hiển thị trên phiếu lương</p>
          </div>
          <div class="col-span-10 flex h-8 items-center gap-x-6">
            <MsRadioControl
              label="Có"
              id="optionShowPaycheck_1"
              name="optionShowPaycheck"
              :value="1"
            />
            <MsRadioControl
              label="Không"
              id="optionShowPaycheck_2"
              name="optionShowPaycheck"
              :value="2"
            />
            <MsRadioControl
              label="Chỉ hiển thị nếu giá trị khác 0"
              id="optionShowPaycheck_3"
              name="optionShowPaycheck"
              :value="3"
            />
          </div>
        </div>
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-2 h-8 flex items-center">
            <p class="font-normal">Nguồn tạo</p>
          </div>
          <div class="col-span-3">
            <MsSelectControl
              :disabled="true"
              name="generatingSource"
              :options="[{ key: 1, label: 'Tự thêm' }]"
            />
          </div>
        </div>
      </div>
      <div
        v-if="type === 'create' || type === 'double'"
        class="pt-3 flex items-center gap-x-2 justify-end"
      >
        <MsButtonBase label="Hủy bỏ" class="w-20" />
        <MsButtonBase
          label="Lưu và thêm"
          class="border !border-[#0E9A62] !text-[#0E9A62] hover:!bg-[#A8D9C8]"
          @click="handleSaveContinue"
        />
        <MsButtonBase
          label="Lưu"
          class="w-20 !bg-[#0E9A62] text-white !border-[#0E9A62] hover:!bg-[#0A724B]"
          @click="handleSave"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import MsButtonBase from '@/components/ms-button/MsButtonBase.vue'
import MsCheckbox from '@/components/ms-checkbox/MsCheckbox.vue'
import MsInput from '@/components/ms-input/MsInput.vue'
import MsRadioControl from '@/components/ms-radio/MsRadioControl.vue'
import MsSelectControl from '@/components/ms-select/MsSelectControl.vue'
import MsTextarea from '@/components/ms-textarea/MsTextarea.vue'
import { useSalaryCompositionValidation } from '@/composables/useSalaryCompositionValidation'
import {
  AutoSumOrgLevel,
  CompositionNature,
  CompositionType,
  SumScope,
  ValueType,
} from '@/constants/common'
import { useForm } from 'vee-validate'
import { watch, nextTick, ref } from 'vue'
import SelectRelatedComposition from './SelectRelatedComposition.vue'
import http from '@/utils/http.js'
import { listApi } from '@/constants/list-api.js'
import { useToast } from 'primevue/usetoast'
import { convertToCode } from '@/utils/common.js'
import UnitDropdownBox from './UnitDropdownBox.vue'
import { Button, Menu } from 'primevue'

const props = defineProps({
  type: {
    type: String,
    default: 'create',
  },
  salaryCompositionDetail: {
    type: Object,
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const toast = useToast()

const emit = defineEmits(['close', 'refresh', 'confirm', 'more-double', 'more-delete'])

const { schema, getSalaryCompositionInitialValues } = useSalaryCompositionValidation()

const { setValues, handleSubmit, setFieldValue, values, resetForm } = useForm({
  validationSchema: schema,
  // keepValuesOnUnmount: true,
  initialValues: getSalaryCompositionInitialValues(props.type, props.salaryCompositionDetail),
})
let isInitializing = false

const items = ref([
  {
    items: [
      {
        label: 'Nhân bản',
        icon: 'icon-copy',
        command: () => {
          emit('more-double', props.salaryCompositionDetail.salaryCompositionId)
        },
      },
      {
        label: 'Xóa',
        icon: 'icon-trash-red',
        command: () => {
          emit('more-delete', props.salaryCompositionDetail)
        },
      },
    ],
  },
])

const menuMore = ref()
const toggleMoreAction = (event) => {
  menuMore.value.toggle(event)
}

watch(
  () => values.compositionType,
  (newVal) => {
    if (isInitializing) return
    if (newVal === 2 || newVal === 4 || newVal === 5) {
      setFieldValue('compositionNature', 3)
      setFieldValue('valueType', 3)
    } else {
      setFieldValue('compositionNature', 1)
      setFieldValue('valueType', 1)
    }
  },
)

watch(
  () => values.compositionNature,
  (newVal) => {
    if (isInitializing) return
    if (newVal === 1) {
      setFieldValue('taxable', 1)
      setFieldValue('isOverNorms', false)
      setFieldValue('norms', '')
      setFieldValue('valueType', 1)
    } else if (newVal === 2) {
      setFieldValue('isTaxDeductions', false)
      setFieldValue('isOverNorms', false)
      setFieldValue('norms', '')
      setFieldValue('valueType', 1)
    }
  },
)

watch(
  () => values.valueCalculationType,
  (newVal) => {
    if (isInitializing) return
    if (newVal === 1) {
      setFieldValue('sumScope', 1)
      setFieldValue('relatedCompositionId', null)
      setFieldValue('formula', '')
    } else if (newVal === 2) {
      setFieldValue('sumScope', 1)
      setFieldValue('relatedCompositionId', null)
      setFieldValue('formula', '')
    }
  },
)

watch(
  () => values.sumScope,
  (newVal) => {
    if (isInitializing) return
    if (newVal === 3) {
      setFieldValue('autoSumOrgLevel', 4)
    }
  },
)

let lastAutoGeneratedCode = ''

watch(
  () => values.salaryCompositionName,
  (newName) => {
    if (isInitializing) return
    if (props.type === 'update') return

    const codeValue = convertToCode(newName)
    if (!values.salaryCompositionCode || values.salaryCompositionCode === lastAutoGeneratedCode) {
      setFieldValue('salaryCompositionCode', codeValue)
      lastAutoGeneratedCode = codeValue
    }
  },
)

watch(
  [() => props.isOpen, () => props.type, () => props.salaryCompositionDetail],
  async ([isOpen, type, detail]) => {
    if (isOpen) {
      isInitializing = true
      if (type === 'create') {
        setValues({
          ...getSalaryCompositionInitialValues(type, detail),
        })
      } else if (type === 'update' || type === 'double' || type === 'detail') {
        if (detail) {
          setValues({
            ...detail,
            salaryCompositionCode:
              type === 'update' || type === 'detail' ? detail?.salaryCompositionCode : '',
            salaryCompositionName:
              type === 'update' || type === 'detail' ? detail?.salaryCompositionName : '',
          })
        }
      }
      await nextTick()
      isInitializing = false
    }
  },
  { immediate: true },
)

const showToast = (severity, summary, detail) => {
  toast.add({ group: 'toast-alert', severity, summary, detail, life: 3000 })
}

// Hàm dùng chung để lưu dữ liệu lên Server
const executeSaveAPI = async (values) => {
  let submitValues = {
    ...values,
    selectedOrganizationIds: Object.entries(values.selectedOrganizationIds || {})
      .filter(([_, state]) => state.checked)
      .map(([key]) => key),
  }

  if (props.type === 'double' || props.type === 'create') {
    delete submitValues?.salaryCompositionId
  }

  if (props.type === 'update') {
    return await http.put(listApi.SalaryCompositions, {
      ...submitValues,
      salaryCompositionId: props.salaryCompositionDetail.salaryCompositionId,
    })
  } else {
    return await http.post(listApi.SalaryCompositions, submitValues)
  }
}

// Hàm xử lý lưu
const handleSave = handleSubmit(async (values) => {
  try {
    const response = await executeSaveAPI(values)
    if (response.isSuccess) {
      showToast(
        'success',
        'Thành công',
        `${props.type === 'update' ? 'Cập nhật' : 'Thêm'} thành công`,
      )
      resetForm()
      emit('close')
      emit('refresh')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error?.data?.devMessage || 'Có lỗi xảy ra, hãy thử lại')
  }
})

// Hàm xử lý lưu và thêm mới tiếp
const handleSaveContinue = handleSubmit(async (values) => {
  try {
    const response = await executeSaveAPI(values)
    if (response.isSuccess) {
      showToast(
        'success',
        'Thành công',
        `${props.type === 'update' ? 'Cập nhật' : 'Thêm'} thành công`,
      )
      emit('refresh')
      emit('confirm')
      resetForm({
        values: getSalaryCompositionInitialValues(props.type, props.salaryCompositionDetail),
      })
    }
  } catch (error) {
    showToast('error', 'Lỗi', error?.data?.devMessage || 'Có lỗi xảy ra, hãy thử lại')
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-1 w-full">
    <TreeSelect
      v-model="selectedValue"
      size="small"
      :options="nodes"
      selectionMode="checkbox"
      placeholder="Chọn đơn vị"
      display="chip"
      class="w-full !h-8 !rounded-[8px] !text-[13px] font-normal hover:!border-[#0E9A62] focus:!border-[#0E9A62] placeholder:!text-[#9e9e9e]"
      :class="[
        errorMessage && ' hover:!border-[#f7453b] focus:!border-[#f7453b]',
        errorMessage ? '!border-[#f7453b]' : '!border-[#D5D7DA]',
      ]"
    >
      <template #value="slotProps">
        <div v-if="displayNodes.length > 0" class="flex w-full overflow-hidden gap-x-1">
          <div
            v-for="node in displayNodes"
            :key="node.key"
            class="flex items-center bg-[#F5F5F5] hover:bg-[#E9EAEB] gap-x-1 py-0 px-2 rounded-[6px] font-medium border border-[#D5D7DA] text-[12px] text-[#101828] h-6"
          >
            <span>{{ node.label }}</span>
            <i
              class="pi pi-times text-[#717680]"
              style="font-size: 11px"
              @click.stop="removeNode(node.key)"
            ></i>
          </div>
        </div>
        <span v-else class="!text-[13px] text-[#9e9e9e] ml-2">
          {{ slotProps.placeholder }}
        </span>
      </template>
      <template #dropdownicon>
        <div class="icon-chevron-down"></div>
      </template>
      <template #option="{ node, selected }">
        <div :class="['text-[13px]', selected ? 'text-[#0e9a62]' : 'text-[#101828]']">
          {{ node.label }}
        </div>
      </template>
      <!-- <template #footer>
        <div class="flex items-center py-3 px-4 !bg-[#eafbf2] gap-x-2 h-8">
          <Checkbox binary size="small" />
          <label class="font-normal text-[#101828]">Hiển thị đơn vị ngừng theo dõi</label>
        </div>
      </template> -->
    </TreeSelect>
    <p v-if="errorMessage" class="text-xs text-[#f7453b] font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { listApi } from '@/constants/list-api'
import { convertFlatToTree, restoreSelectedValue } from '@/utils/common'
import http from '@/utils/http'
import { TreeSelect } from 'primevue'
import { useField } from 'vee-validate'
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const { value: selectedValue, errorMessage, handleBlur } = useField(props.name)

const nodes = ref([])
const isNodesReady = ref(false)

const displayNodes = computed(() => {
  if (!selectedValue.value || !nodes.value) return []

  const result = []
  const traverse = (treeNodes) => {
    for (const node of treeNodes) {
      if (selectedValue.value[node.key] && selectedValue.value[node.key].checked) {
        result.push(node)
      } else if (node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(nodes.value)
  return result
})

const removeNode = (targetKey) => {
  if (!selectedValue.value) return

  const newSelected = { ...selectedValue.value }

  const removeDescendants = (node) => {
    delete newSelected[node.key]
    if (node.children) {
      node.children.forEach(removeDescendants)
    }
  }

  const findAndRemove = (treeNodes, path) => {
    for (const node of treeNodes) {
      if (node.key === targetKey) {
        path.forEach((ancestor) => {
          delete newSelected[ancestor.key]
        })
        removeDescendants(node)
        return true
      }
      if (node.children) {
        if (findAndRemove(node.children, [...path, node])) {
          return true
        }
      }
    }
    return false
  }

  findAndRemove(nodes.value, [])
  selectedValue.value = newSelected
}

const getData = async () => {
  const response = await http.get(listApi.Organizations)
  if (response.isSuccess) {
    nodes.value = convertFlatToTree(response.data)
    isNodesReady.value = true

    if (Array.isArray(selectedValue.value) && selectedValue.value.length > 0) {
      selectedValue.value = restoreSelectedValue(selectedValue.value, nodes.value)
    }
  }
}

watch(selectedValue, (val) => {
  if (isNodesReady.value) {
    if (Array.isArray(val) && val.length > 0) {
      selectedValue.value = restoreSelectedValue(val, nodes.value)
    }
  }
})

onMounted(() => {
  getData()
})
</script>

<style scoped lang="scss"></style>

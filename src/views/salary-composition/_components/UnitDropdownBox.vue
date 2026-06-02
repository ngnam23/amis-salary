<template>
  <div class="card flex justify-center">
    <TreeSelect
      v-model="selectedValue"
      size="small"
      :options="nodes"
      selectionMode="checkbox"
      placeholder="Tất cả đơn vị"
      display="chip"
      class="w-[350px] !h-8 !rounded-[8px] !text-[13px] font-normal hover:!border-[#0E9A62] focus:!border-[#0E9A62] placeholder:!text-[#9e9e9e]"
    >
      <template #value="slotProps">
        <div v-if="displayNodes.length > 0" class="flex w-full overflow-hidden gap-x-1">
          <div
            v-for="node in displayNodes"
            :key="node.key"
            class="flex items-center bg-[#F5F5F5] gap-x-1 py-0 px-2 rounded-[6px] font-medium border border-[#D5D7DA] text-[12px] text-[#101828] h-6"
          >
            <span>{{ node.label }}</span>
            <i class="pi pi-times" style="font-size: 12px" @click.stop="removeNode(node.key)"></i>
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
      <template #footer>
        <div class="flex items-center py-3 px-4 !bg-[#eafbf2] gap-x-2 h-8">
          <Checkbox binary size="small" />
          <label class="font-normal text-[#101828]">Hiển thị đơn vị ngừng theo dõi</label>
        </div>
      </template>
    </TreeSelect>
  </div>
</template>

<script setup>
import { Checkbox, TreeSelect } from 'primevue'
import { ref, computed } from 'vue'

const nodes = ref([
  {
    key: '0',
    label: 'Misa Test pdthien 2024',
    data: 'Documents Folder',
    children: [
      {
        key: '0-0',
        label: 'Chi nhánh miền Bắc',
        data: 'Work Folder',
        children: [
          {
            key: '0-0-0',
            label: 'Khối sản xuất',
            data: 'Expenses Document',
            children: [
              {
                key: '0-0-0-0',
                label: 'Dự án Core',
                data: 'Expenses Document',
              },
              {
                key: '0-0-0-1',
                label: 'Dự án C&B',
                data: 'Resume Document',
              },
            ],
          },
          { key: '0-0-1', label: 'Trung tâm kinh doanh', data: 'Resume Document' },
          { key: '0-0-2', label: 'Trung tâm hỗ trợ khách hàng', data: 'Resume Document' },
        ],
      },
      {
        key: '0-1',
        label: 'Chi nhánh miền Bắc',
        data: 'Home Folder',
        children: [
          {
            key: '0-1-0',
            label: 'Trung tâm kinh doanh',
            data: 'Invoices for this month',
          },
        ],
      },
    ],
  },
])
const selectedValue = ref(null)

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
</script>

<style scoped lang="scss"></style>

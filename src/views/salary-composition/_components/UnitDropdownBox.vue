<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="treeBoxValue"
          :value-expr="'id'"
          :display-expr="'text'"
          :placeholder="'Tất cả đơn vị'"
          :show-clear-button="true"
          :data-source="treeDataSource"
          @value-changed="syncTreeViewSelection"
        >
          <template #content>
            <DxTreeView
              :data-source="treeDataSource"
              :select-by-click="true"
              :selection-mode="'multiple'"
              :show-checkboxes-mode="'normal'"
              :key-expr="'id'"
              :parent-id-expr="'parentId'"
              :display-expr="'text'"
              :select-nodes-recursive="true"
              @selection-changed="treeViewSelectionChanged"
              @content-ready="syncTreeViewSelection"
              ref="treeViewRef"
            />
          </template>
        </DxDropDownBox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DxDropDownBox } from 'devextreme-vue/drop-down-box'
import { DxTreeView } from 'devextreme-vue/tree-view'

// 1. Khởi tạo dữ liệu dạng phẳng (Flat List) với ID và ParentID
const organizationalData = [
  { id: 1, text: 'Misa Test pdthien 2024', parentId: 0 },
  { id: 2, text: 'Chi nhánh miền Bắc', parentId: 1 },
  { id: 3, text: 'Chi nhánh miền Nam', parentId: 1 },
]

// 2. State lưu trữ danh sách các ID được chọn (ví dụ chọn nhiều: [2, 3])
const treeBoxValue = ref([1, 2, 3])
const treeViewRef = ref(null)

const treeDataSource = computed(() => organizationalData)

// 3. Đồng bộ khi người dùng tích chọn trên TreeView -> Cập nhật lên DropDownBox
const treeViewSelectionChanged = (e) => {
  const treeView = e.component
  // Lấy danh sách các node được chọn
  const selectedNodes = treeView.getSelectedNodes()
  // Map lại để chỉ lấy mảng các ID
  treeBoxValue.value = selectedNodes.map((node) => node.itemData.id)
}

// 4. Đồng bộ ngược lại khi giá trị DropDownBox thay đổi hoặc khi load xong giao diện
const syncTreeViewSelection = (e) => {
  const treeView = treeViewRef.value?.instance || e?.component
  if (!treeView) return

  // Xóa các lựa chọn cũ và set lại theo giá trị hiện tại của treeBoxValue
  treeView.unselectAll()
  if (treeBoxValue.value) {
    treeBoxValue.value.forEach((id) => {
      treeView.selectItem(id)
    })
  }
}
</script>

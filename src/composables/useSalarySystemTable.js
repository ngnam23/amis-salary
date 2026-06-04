import { listApi } from '@/constants/list-api'
import { debounce } from '@/utils/debounce'
import http from '@/utils/http'
import { ref } from 'vue'
import { SALARY_COMPOSITION_FIELDS } from '@/constants/common'

const fields = ref(
  JSON.parse(localStorage.getItem('salaryCompositionFields')) || [...SALARY_COMPOSITION_FIELDS],
)

/**
 * Cập nhật danh sách các cột hiển thị và lưu vào localStorage
 * @param {Array} newFields - Danh sách các trường thông tin mới
 */
const updateFields = (newFields) => {
  fields.value = [...newFields]
  localStorage.setItem('salaryCompositionFields', JSON.stringify(fields.value))
}

/**
 * Composable quản lý logic cho bảng (phân trang, tìm kiếm, lọc)
 * @returns {Object} Các state và phương thức xử lý bảng
 */
export const useSalarySystemTable = () => {
  const rows = ref([])
  const totalItems = ref(0)
  const pageIndex = ref(1)
  const pageSize = ref(20)
  const keyword = ref('')
  const compositionType = ref(-1)
  const isLoading = ref(false)

  /**
   * Hàm debounce gọi API lấy dữ liệu để tránh gọi liên tục khi người dùng gõ tìm kiếm
   */
  const debounceGetData = debounce(() => {
    pageIndex.value = 1
    getData()
  }, 800)

  /**
   * Gọi API lấy danh sách từ server
   */
  const getData = async () => {
    isLoading.value = true
    try {
      const response = await http.get(`${listApi.SalaryCompositionSystems}/paging`, {
        params: {
          pageSize: pageSize.value,
          pageIndex: pageIndex.value,
          keyword: keyword.value,
          compositionType: +compositionType.value === -1 ? null : +compositionType.value,
        },
      })
      if (response.isSuccess) {
        rows.value = response.data.data
        totalItems.value = response.data.total
      }
      isLoading.value = false
    } catch (error) {
      console.error('Error fetching list:', error)
      rows.value = []
      totalItems.value = 0
      isLoading.value = false
    }
  }

  return {
    rows,
    totalItems,
    keyword,
    pageIndex,
    pageSize,
    compositionType,
    fields,
    isLoading,
    getData,
    debounceGetData,
    updateFields,
  }
}

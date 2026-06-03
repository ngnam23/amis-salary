import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { ref } from 'vue'

/**
 * Composable quản lý trạng thái và hành động cho Dialog Nhân viên
 * @returns {Object} Các state và phương thức xử lý Dialog
 */
export const useSalaryCompositionGrid = () => {
  const isOpenSalaryCompositionGrid = ref(false)
  const salaryCompositionDetail = ref(null)
  const type = ref('create')

  /**
   * Lấy thông tin chi tiết của một nhân viên theo ID
   * @param {string} id - ID của nhân viên cần lấy thông tin
   */
  const getSalaryCompositionDetail = async (id) => {
    try {
      const response = await http.get(`${listApi.SalaryCompositions}/${id}`)
      if (response.isSuccess) {
        salaryCompositionDetail.value = response.data
      }
    } catch {
      salaryCompositionDetail.value = null
    }
  }

  /**
   * Mở Dialog để tạo mới nhân viên (lấy mã mới và đặt type = 'create')
   */
  const handleOpenCreate = async () => {
    type.value = 'create'
    isOpenSalaryCompositionGrid.value = true
  }

  /**
   * Mở Dialog để cập nhật thông tin thành phần lương (lấy thông tin chi tiết và đặt type = 'update')
   * @param {string} id - ID của thành phần lương cần cập nhật
   */
  const handleOpenToUpdate = async (id) => {
    await getSalaryCompositionDetail(id)
    type.value = 'update'
    isOpenSalaryCompositionGrid.value = true
  }

  /**
   * Mở Dialog để nhân bản thành phần lương (lấy thông tin cũ, lấy mã mới và đặt type = 'double')
   * @param {string} id - ID của thành phần lương cần nhân bản
   */
  const handleOpenToDouble = async (id) => {
    await getSalaryCompositionDetail(id)
    type.value = 'double'
    isOpenSalaryCompositionGrid.value = true
  }

  /**
   * Xử lý sau khi lưu và muốn thêm tiếp (lấy mã mới và giữ trạng thái create)
   */
  const handleSaveAndAdd = async () => {
    type.value = 'create'
    salaryCompositionDetail.value = null
  }

  return {
    isOpenSalaryCompositionGrid,
    salaryCompositionDetail,
    type,
    handleOpenCreate,
    handleOpenToUpdate,
    handleOpenToDouble,
    handleSaveAndAdd,
  }
}

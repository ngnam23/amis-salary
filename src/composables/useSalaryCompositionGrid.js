import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { ref } from 'vue'

/**
 * Composable quản lý trạng thái và hành động cho Dialog Nhân viên
 * @returns {Object} Các state và phương thức xử lý Dialog
 */
export const useSalaryCompositionGrid = () => {
  const isOpenSalaryCompositionGrid = ref(false)
  const employeeDetail = ref(null)
  const type = ref('create')

  /**
   * Lấy thông tin chi tiết của một nhân viên theo ID
   * @param {string} employeeID - ID của nhân viên cần lấy thông tin
   */
  const getEmployeeDetail = async (employeeID) => {
    try {
      const response = await http.get(`${listApi.Employees}/${employeeID}`)
      if (response.success) {
        employeeDetail.value = response.data
      }
    } catch {
      employeeDetail.value = null
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
   * Mở Dialog để cập nhật thông tin nhân viên (lấy thông tin chi tiết và đặt type = 'update')
   * @param {string} employeeID - ID của nhân viên cần cập nhật
   */
  const handleOpenToUpdate = async (employeeID) => {
    await getEmployeeDetail(employeeID)
    type.value = 'update'
    isOpenSalaryCompositionGrid.value = true
  }

  /**
   * Mở Dialog để nhân bản nhân viên (lấy thông tin cũ, lấy mã mới và đặt type = 'double')
   * @param {string} employeeID - ID của nhân viên cần nhân bản
   */
  const handleOpenToDouble = async (employeeID) => {
    await getEmployeeDetail(employeeID)
    type.value = 'double'
    isOpenSalaryCompositionGrid.value = true
  }

  /**
   * Xử lý sau khi lưu và muốn thêm tiếp (lấy mã mới và giữ trạng thái create)
   */
  const handleSaveAndAdd = async () => {
    type.value = 'create'
  }

  return {
    isOpenSalaryCompositionGrid,
    employeeDetail,
    type,
    handleOpenCreate,
    handleOpenToUpdate,
    handleOpenToDouble,
    handleSaveAndAdd,
  }
}

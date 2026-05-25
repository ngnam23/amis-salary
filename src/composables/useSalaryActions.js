import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

/**
 * Composable quản lý các hành động thao tác với dữ liệu (xóa, đổi trạng thái, ...)
 * @param {Ref} rows - Danh sách các dòng dữ liệu hiện tại
 * @param {Ref} selectedIdsArray - Danh sách các ID đang được chọn
 * @param {Function} getData - Hàm để tải lại dữ liệu khi có thay đổi
 * @param {Function} handleOpenDialogToDouble - Hàm mở dialog nhân bản
 * @returns {Object} Các phương thức xử lý hành động
 */
export const useSalaryActions = (rows, selectedIdsArray, getData, resetSelectedIds) => {
  const confirm = useConfirm()
  const toast = useToast()

  /**
   * Hiển thị thông báo (toast message) lên giao diện
   * @param {string} severity - Mức độ thông báo (success, error, info, ...)
   * @param {string} summary - Tiêu đề thông báo
   * @param {string} detail - Nội dung chi tiết thông báo
   */
  const showToast = (severity, summary, detail) => {
    toast.add({ severity, summary, detail, life: 3000, position: 'top-center' })
  }

  /**
   * Hiển thị hộp thoại xác nhận trước khi thực hiện hành động
   * @param {string} message - Nội dung câu hỏi xác nhận
   * @param {Function} onAccept - Hàm callback khi người dùng chọn 'Có'
   */
  const showConfirm = (
    message,
    onAccept,
    header = 'Xác nhận',
    acceptLabel = 'Đồng ý',
    rejectLabel = 'Hủy bỏ',
    acceptClass = '',
    rejectClass = '',
  ) => {
    confirm.require({
      group: 'confirm-dialog',
      header,
      message,
      acceptLabel,
      rejectLabel,
      acceptClass,
      rejectClass,
      accept: onAccept,
    })
  }

  /**
   * Gọi API xóa item theo danh sách ID
   * @param {string|Array} ids - ID hoặc mảng ID item cần xóa
   */
  const handleDeleteSalaryComposition = async (ids) => {
    const idString = typeof ids === 'string' ? ids : ids.join(',')
    try {
      const response = await http.delete(listApi.SalaryCompositionsDelete, { data: idString })
      if (response.isSuccess) {
        showToast('success', 'Thành công', 'Đã xóa thành công')
        getData()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('error', 'Lỗi', error.message || 'Đã xảy ra lỗi')
    }
    resetSelectedIds()
  }

  /**
   * Gọi API thay đổi trạng thái (Sử dụng/Ngừng sử dụng) của nhân viên
   * @param {number} status - Trạng thái mới (1: Sử dụng, 0: Ngừng sử dụng)
   * @param {string|Array} ids - ID hoặc mảng ID nhân viên cần thay đổi
   */
  const handleChangeStatusSalaryComposition = async (status, ids) => {
    const idString = typeof ids === 'string' ? ids : ids.join(',')
    try {
      const response = await http.put(listApi.SalaryCompositionsStatus, { status, ids: idString })
      if (response.isSuccess) {
        showToast('success', 'Thành công', 'Đã thay đổi trạng thái thành công')
        getData()
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('error', 'Lỗi', error.message || 'Đã xảy ra lỗi')
    }
    resetSelectedIds()
  }

  /**
   * Xử lý các hành động hàng loạt trên các nhân viên đã được chọn
   * @param {Object} action - Đối tượng hành động chứa label và giá trị (deleteAll, activeAll, ...)
   */
  const handleActionAll = (action) => {
    if (action.value === 'deleteAll') {
      showConfirm(
        `Bạn có chắc chắn muốn xóa thành phần lương đã chọn không?`,
        () => {
          handleDeleteSalaryComposition(selectedIdsArray.value)
        },
        'Thông báo',
        'Xóa',
        'Hủy',
        '!bg-[#F04438] !border-[#F04438] hover:!bg-[#D92D20]',
        '',
      )
    } else if (action.value === 'activeAll') {
      showConfirm(
        `Bạn có chắc chắn muốn chuyển trạng thái thành phần lương đã chọn sang đang theo dõi không?`,
        () => {
          handleChangeStatusSalaryComposition(1, selectedIdsArray.value)
        },
        'Chuyển trạng thái',
      )
    } else if (action.value === 'unActiveAll') {
      showConfirm(
        `Bạn có chắc chắn muốn chuyển trạng thái các thành phần lương đã chọn sang ngừng theo dõi không?`,
        () => {
          handleChangeStatusSalaryComposition(0, selectedIdsArray.value)
        },
        'Chuyển trạng thái',
      )
    }
  }

  /**
   * Xử lý hành động được chọn từ menu dropdown của từng dòng trong bảng
   * @param {Object} option - Tùy chọn hành động được chọn (delete, toggleStatus, double)
   * @param {Object} row - Dữ liệu của dòng nhân viên tương ứng
   */
  const handleRowSelect = (option, row) => {
    if (option.value === 'delete') {
      showConfirm(`Bạn có thực sự muốn xóa Nhân viên <${row.employeeCode}> không?`, () => {
        handleDeleteSalaryComposition([row.employeeID])
      })
    } else if (option.value === 'toggleStatus') {
      handleChangeStatusSalaryComposition(row.isActive ? 0 : 1, [row.employeeID])
    } else if (option.value === 'double') {
      //   handleOpenDialogToDouble(row.employeeID)
    }
  }

  return {
    handleDeleteSalaryComposition,
    handleChangeStatusSalaryComposition,
    handleActionAll,
    handleRowSelect,
  }
}

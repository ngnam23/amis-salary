export const SIDEBAR_MENU = [
  {
    name: 'Tổng quan',
    icon: 'icon-sidebar-dashboard',
    route: '/',
  },
  {
    name: 'Thành phần lương',
    icon: 'icon-sidebar-salary-composition',
    route: '/salarycomposition',
  },
  {
    name: 'Mẫu bảng lương',
    icon: 'icon-sidebar-salary-template',
    route: '/',
  },
  {
    name: 'Dữ liệu tính lương',
    icon: 'icon-sidebar-salary-data',
    route: '/',
  },
  {
    name: 'Tính lương',
    icon: 'icon-sidebar-salary-table',
    route: '/',
  },
  {
    name: 'Chi trả lương',
    icon: 'icon-sidebar-payment',
    route: '/',
  },
  {
    name: 'Báo cáo',
    icon: 'icon-sidebar-report',
    route: '/',
  },
]

export const SALARY_COMPOSITION_FIELDS = [
  { key: 'salaryCompositionCode', label: 'Mã thành phần', width: 200, display: true },
  { key: 'salaryCompositionName', label: 'Tên thành phần', width: 200, display: true },
  { key: 'organizationIds', label: 'Đơn vị áp dụng', width: 200, display: true },
  { key: 'compositionType', label: 'Loại thành phần', width: 200, display: true },
  { key: 'compositionNature', label: 'Tính chất', width: 200, display: true },
  { key: 'taxable', label: 'Chịu thuế', width: 200, display: true },
  { key: 'isTaxDeductions', label: 'Giảm trừ khi tính thuế', width: 200, display: true },
  { key: 'norms', label: 'Định mức', width: 200, display: true },
  { key: 'valueType', label: 'Kiểu giá trị', width: 200, display: true },
  { key: 'formula', label: 'Giá trị', width: 200, display: true },
  { key: 'description', label: 'Mô tả', width: 200, display: true },
  { key: 'optionShowPaycheck', label: 'Hiển thị trên phiếu lương', width: 200, display: true },
  { key: 'generatingSource', label: 'Nguồn tạo', width: 200, display: true },
  { key: 'isActive', label: 'Trạng thái', width: 200, display: true },
]

export const SALARY_COMPOSITION_SYSTEM_FIELDS = [
  { key: 'salaryCompositionCode', label: 'Mã thành phần', width: 200, display: true },
  { key: 'salaryCompositionName', label: 'Tên thành phần', width: 200, display: true },
  { key: 'compositionType', label: 'Loại thành phần', width: 200, display: true },
  { key: 'compositionNature', label: 'Tính chất', width: 200, display: true },
  { key: 'taxable', label: 'Chịu thuế', width: 200, display: true },
  { key: 'isTaxDeductions', label: 'Giảm trừ khi tính thuế', width: 200, display: true },
  { key: 'norms', label: 'Định mức', width: 200, display: true },
  { key: 'valueType', label: 'Kiểu giá trị', width: 200, display: true },
  { key: 'formula', label: 'Giá trị', width: 200, display: true },
  { key: 'description', label: 'Mô tả', width: 200, display: true },
  { key: 'optionShowPaycheck', label: 'Hiển thị trên phiếu lương', width: 200, display: true },
]

export const CompositionType = [
  { key: 1, label: 'Thông tin nhân viên' },
  { key: 2, label: 'Chấm công' },
  { key: 3, label: 'Doanh số' },
  { key: 4, label: 'KPI' },
  { key: 5, label: 'Sản phẩm' },
  { key: 6, label: 'Lương' },
  { key: 7, label: 'Thuế TNCN' },
  { key: 8, label: 'Bảo hiểm - Công đoàn' },
  { key: 9, label: 'Khác' },
]

export const CompositionNature = [
  { key: 1, label: 'Thu nhập' },
  { key: 2, label: 'Khấu trừ' },
  { key: 3, label: 'Khác' },
]

export const Taxable = [
  { key: 1, label: 'Chịu thuế' },
  { key: 2, label: 'Miễn thuế toàn phần' },
  { key: 3, label: 'Miễn thuế một phần' },
]

export const ValueType = [
  { key: 1, label: 'Tiền tệ' },
  { key: 2, label: 'Ngày' },
  { key: 3, label: 'Số' },
  { key: 4, label: 'Chữ' },
  { key: 5, label: 'Phần trăm' },
]

export const OptionShowPaycheck = [
  { key: 1, label: 'Có' },
  { key: 2, label: 'Không' },
  { key: 3, label: 'Chỉ hiển thị nếu giá trị khác 0' },
]

export const SumScope = [
  {
    key: 1,
    label: 'Trong cùng đơn vị công tác',
  },
  {
    key: 2,
    label: 'Dưới quyền',
  },
  {
    key: 3,
    label: 'Thuộc cơ cấu tổ chức',
  },
]

export const PAGE_SIZE_OPTIONS = [
  { key: 15, label: '15' },
  { key: 20, label: '20' },
  { key: 50, label: '50' },
  { key: 100, label: '100' },
]

export const AutoSumOrgLevel = [
  {
    key: 1,
    label: 'Cấp 1',
  },
  {
    key: 2,
    label: 'Cấp 2',
  },
  {
    key: 3,
    label: 'Cấp 3',
  },
  {
    key: 4,
    label: 'Cấp 4',
  },
]

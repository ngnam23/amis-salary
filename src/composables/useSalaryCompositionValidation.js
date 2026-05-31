import * as yup from 'yup'

export const useSalaryCompositionValidation = () => {
  const schema = yup.object({
    salaryCompositionName: yup.string().required('Không được để trống'),
    salaryCompositionCode: yup.string().required('Không được để trống'),
    compositionType: yup
      .number('Không được để trống')
      .required('Không được để trống')
      .notOneOf([0], 'Không được để trống'),
    compositionNature: yup
      .number('Không được để trống')
      .required('Không được để trống')
      .notOneOf([0], 'Không được để trống'),
    taxable: yup.number().nullable(),
    isTaxDeductions: yup.boolean().nullable(),
    norms: yup.string().nullable(),
    isOverNorms: yup.boolean().nullable(),
    valueType: yup.number('Không được để trống').nullable(),
    valueCalculationType: yup.number().nullable(),
    sumScope: yup.number().nullable(),
    autoSumOrgLevel: yup.number().nullable(),
    relatedCompositionId: yup.string().nullable(),
    formula: yup.string().nullable(),
    description: yup.string().nullable(),
    optionShowPaycheck: yup.number().nullable(),
    generatingSource: yup.number().nullable(),
  })

  const getSalaryCompositionInitialValues = (type, salaryCompositionDetail) => {
    return {
      salaryCompositionCode:
        type === 'update' ? salaryCompositionDetail?.salaryCompositionCode : '',
      compositionNature: 1,
      taxable: 1,
      isTaxDeductions: false,
      isOverNorms: false,
      norms: '',
      valueType: 1,
      valueCalculationType: 2,
      sumScope: 1,
      autoSumOrgLevel: 4,
      relatedCompositionId: null,
      formula: '',
      description: '',
      optionShowPaycheck: 1,
      generatingSource: 1,
    }
  }

  return {
    schema,
    getSalaryCompositionInitialValues,
  }
}

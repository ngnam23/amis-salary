export const removeVietnameseTones = (str) => {
  if (!str) return ''
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|E|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|U|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Y|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const convertToCode = (str) => {
  if (!str) return ''
  const noTones = removeVietnameseTones(str)
  return noTones.replace(/\s+/g, '_').toUpperCase()
}

export const convertFlatToTree = (list) => {
  const map = {}
  const tree = []

  // Bước 1: Khởi tạo Map và format lại các trường theo chuẩn UI Tree (key, label, data)
  list.forEach((item) => {
    map[item.organizationKey] = {
      key: item.organizationKey,
      label: item.organizationName,
      data: item.organizationData,
      organizationId: item.organizationId, // Giữ lại ID thật phục vụ lưu trữ
      children: [],
    }
  })

  // Bước 2: Duyệt danh sách lần nữa để móc nối quan hệ Cha - Con
  list.forEach((item) => {
    const parentId = item.organizationParentId
    const currentKey = item.organizationKey

    if (parentId !== null && map[parentId]) {
      // Nếu có cha và cha tồn tại trong map -> đẩy vào mảng children của cha
      map[parentId].children.push(map[currentKey])
    } else {
      // Nếu không có cha (parentId = null), đây là Node Gốc (Root)
      tree.push(map[currentKey])
    }
  })

  // Bước 3: Dọn dẹp các mảng children trống (nếu node không có con thì xóa thuộc tính children đi cho sạch)
  const cleanChildren = (nodes) => {
    nodes.forEach((node) => {
      if (node.children.length === 0) {
        delete node.children
      } else {
        cleanChildren(node.children)
      }
    })
  }
  cleanChildren(tree)

  return tree
}

export const restoreSelectedValue = (selectedKeys, treeNodes) => {
  const keySet = new Set(selectedKeys)
  const result = {}

  const processNode = (node) => {
    const childResults = (node.children || []).map(processNode)

    const allChildrenChecked =
      node.children?.length > 0 && childResults.every((r) => r === 'checked')

    const anyChildChecked = childResults.some((r) => r === 'checked' || r === 'partial')

    if (keySet.has(node.key) || allChildrenChecked) {
      result[node.key] = { checked: true, partialChecked: false }
      return 'checked'
    } else if (anyChildChecked) {
      result[node.key] = { checked: false, partialChecked: true }
      return 'partial'
    }

    return 'none'
  }

  treeNodes.forEach(processNode)
  return result
}

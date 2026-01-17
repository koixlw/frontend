import http from '../utils/http'

/**
 * 传承人相关API
 */

// 获取所有传承人列表
export const getAllInheritors = () => {
  return http.get('/inheritors')
}

// 分页查询传承人
export const getInheritorsByPage = (params) => {
  return http.get('/inheritors/page', { params })
}

// 根据ID获取传承人基本信息
export const getInheritorById = (id) => {
  return http.get(`/inheritors/${id}`)
}

// 根据ID获取传承人完整详细信息（新接口）
export const getInheritorDetailById = (id) => {
  return http.get(`/inheritors/${id}/detail`)
}

// 根据级别获取传承人列表
export const getInheritorsByLevel = (level) => {
  return http.get(`/inheritors/level/${level}`)
}

// 根据地区获取传承人列表
export const getInheritorsByRegion = (region) => {
  return http.get(`/inheritors/region/${region}`)
}

// 根据关键词搜索传承人
export const searchInheritors = (keyword) => {
  return http.get('/inheritors/search', { params: { keyword } })
}

// 综合查询传承人
export const queryInheritors = (queryDTO) => {
  return http.post('/inheritors/query', queryDTO)
}

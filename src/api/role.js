import request from '@/utils/request'

export function queryByPage(pageNum, pageSize) {
  var data = {
    pageNum,
    pageSize
  }
  return request({
    url: '/api/auth/role/queryByPage',
    method: 'post',
    data
  })
}

export function save(data) {
  let method = 'post'
  if (data.id && data.id !== '') {
    method = 'put'
  }
  return request({
    url: '/api/auth/role',
    method: method,
    data
  })
}

export function remove(id) {
  return request({
    url: `/api/auth/role/${id}`,
    method: 'delete'
  })
}

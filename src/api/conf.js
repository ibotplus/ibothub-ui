import request from '@/utils/request'

export function save(data) {
  const formData = new FormData()
  console.log(data)

  return request({
    url: '/api/sys/conf',
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: `/api/sys/conf/${id}`,
    method: 'delete'
  })
}

export function queryList(data) {
  return request({
    url: `/api/sys/conf/queryList`,
    method: 'post',
    data
  })
}

export function permitList() {
  return request({
    url: `/api/sys/conf/permitList`,
    method: 'post'
  })
}


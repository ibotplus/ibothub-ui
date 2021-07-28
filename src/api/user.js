import request from '@/utils/request'

export function login(data) {
  const formData = new FormData()
  formData.append('username', data.username)
  formData.append('password', data.password)

  return request({
    method: 'post',
    url: '/login',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true,
    data: formData
  })
}

export function getInfo(token) {
  return request({
    url: '/api/auth/user',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function routes() {
  return request({
    url: '/api/auth/perm/routes',
    method: 'post'
  })
}

export function queryByPage(pageNum, pageSize) {
  var data = {
    pageNum,
    pageSize
  }
  return request({
    url: '/api/auth/user/queryByPage',
    method: 'post',
    data
  })
}

export function queryById(id) {
  return request({
    url: `/api/auth/user/${id}`,
    method: 'get'
  })
}

export function save(data) {
  let method = 'post'
  if (data.id && data.id !== '') {
    method = 'put'
  }
  return request({
    url: '/api/auth/user',
    method: method,
    data
  })
}

export function remove(id) {
  return request({
    url: `/api/auth/user/${id}`,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function queryByPage(pageNum, pageSize) {
  var data = {
    pageNum,
    pageSize
  }
  return request({
    url: '/api/auth/perm/queryByPage',
    method: 'post',
    data
  })
}

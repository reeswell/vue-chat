import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/upload/uploadFile',
    method: 'post',
    data
  })
}

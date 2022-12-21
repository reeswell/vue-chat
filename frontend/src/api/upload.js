import http from '@/utils/http'

export function uploadFile(data) {
  return http.post(`/upload/uploadFile`, data)
}

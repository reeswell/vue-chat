import http from '@/utils/http'
import url from './url'

const upload = {
  uploadFile(data) {
    return http.post(`${url.upload}/uploadFile`, data)
  }
}

export default upload

import request from '@/utils/request'

export function statistics() {
  return request({
    url: '/data/summary',
    method: 'get'
  })
}

import request from '@/utils/request'

export function run(data) {
  return request({
    url: '/cases/run',
    method: 'post',
    data
  })
}

export function group() {
  return request({
    url: '/cases/group',
    method: 'get'
  })
}

export function getList(params) {
  return request({
    url: '/cases/list',
    method: 'get',
    params
  })
}

export function getSearch(keyword) {
  return request({
    url: '/cases/search',
    method: 'get',
    params: { keyword }
  })
}

export function getLogList(params) {
  return request({
    url: '/cases/log/list',
    method: 'get',
    params
  })
}

export function detail(id) {
  return request({
    url: '/cases/detail',
    method: 'get',
    params: { id }
  })
}

export function likeCase(id) {
  return request({
    url: '/cases/like',
    method: 'get',
    params: { id }
  })
}

export function collectionCase(id) {
  return request({
    url: '/cases/collection',
    method: 'get',
    params: { id }
  })
}

export function insertParams(data) {
  return request({
    url: '/cases/params/insert',
    method: 'post',
    data
  })
}

export function updateParams(data) {
  return request({
    url: '/cases/params/update',
    method: 'post',
    data
  })
}

export function deleteParams(id) {
  return request({
    url: '/cases/params/delete',
    method: 'get',
    params: { id }
  })
}

export function getParmasList(params) {
  return request({
    url: '/cases/params/list',
    method: 'get',
    params
  })
}

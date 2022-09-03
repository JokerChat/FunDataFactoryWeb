import request from '@/utils/request'

export function getProjectList(params) {
  return request({
    url: '/project/list',
    method: 'get',
    params
  })
}

export function deleteProject(id) {
  return request({
    url: '/project/delete',
    method: 'get',
    params: { id }
  })
}

export function initProject(id) {
  return request({
    url: '/project/init',
    method: 'get',
    params: { id }
  })
}

export function syncProject(id) {
  return request({
    url: '/project/sync',
    method: 'get',
    params: { id }
  })
}

export function insertProject(data) {
  return request({
    url: '/project/insert',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

export function readProject(id) {
  return request({
    url: '/project/read',
    method: 'get',
    params: { id }
  })
}

export function operationProject(id) {
  return request({
    url: '/project/operation',
    method: 'get',
    params: { id }
  })
}

export function getRoleList(params) {
  return request({
    url: '/project/role/list',
    method: 'get',
    params
  })
}

export function insertProjectRole(data) {
  return request({
    url: '/project/role/insert',
    method: 'post',
    data
  })
}

export function updateProjectRole(data) {
  return request({
    url: '/project/role/update',
    method: 'post',
    data
  })
}

export function deleteProjectRole(id) {
  return request({
    url: '/project/role/delete',
    method: 'get',
    params: { id }
  })
}

export function projectDetail(id) {
  return request({
    url: '/project/detail',
    method: 'get',
    params: { id }
  })
}

export function allProject() {
  return request({
    url: '/project/all',
    method: 'get'
  })
}

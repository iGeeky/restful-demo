import request from '@/utils/request'

export async function add(model, data) {
  return await request({
    url: `/${model}`,
    method: 'post',
    data: data,
  })
}

export async function update(model, id, data) {
  data = Object.assign({ id }, data)
  return await request({
    url: `/${model}`,
    method: 'put',
    data,
  })
}

export async function deleteById(model, id) {
  const data = { id: id }
  return await request({
    url: `/${model}`,
    method: 'delete',
    data,
  })
}

export async function list(model, args) {
  return await request({
    url: `/${model}/list`,
    method: 'get',
    params: args,
  })
}

export async function checkNameExist(name, excludeId) {
  return 1
}


import request, { methods } from '@/utils/request';

const router = 'org-staffs';
const version = 'v2';

export async function query(params = {}) {
  return request(`/${version}/${router}`, { params });
}

export async function get(id, params = {}) {
  return request(`/${version}/${router}/${id}`, { params });
}

export async function view(id, params = {}) {
  return request(`/${version}/${router}/${id}/view`, { params });
}

export async function create(data) {
  return request(`/${version}/${router}`, {
    method: methods.POST,
    data,
  });
}

export async function update(id, data) {
  return request(`/${version}/${router}/${id}`, {
    method: methods.PUT,
    data,
  });
}

export async function del(id, params = {}) {
  return request(`/${version}/${router}/${id}`, {
    method: methods.DELETE,
    params,
  });
}

export async function enable(id, params = {}) {
  return request(`/${version}/${router}/${id}/enable`, {
    method: methods.PATCH,
    params,
  });
}

export async function disable(id, params = {}) {
  return request(`/${version}/${router}/${id}/disable`, {
    method: methods.PATCH,
    params,
  });
}

import request, { methods, baseURL } from '@/utils/request';

const version = 'v2';

// 验证码ID
export async function captchaID() {
  return request(`/${version}/pub/signin/captchaid`);
}

// 图形验证码
export function captcha(id) {
  return `${baseURL}/${version}/pub/signin/captcha?id=${id}`;
}

export async function signIn(data) {
  return request(`/${version}/pub/signin`, {
    method: methods.POST,
    data,
    hideNotify: true,
  });
}

export async function signOut() {
  return request(`/${version}/pub/signin/exit`, {
    method: methods.POST,
  });
}

export async function updatePwd(data) {
  return request(`/${version}/pub/current/password`, {
    method: methods.PUT,
    data,
  });
}

export async function getCurrentUser() {
  return request(`/${version}/pub/current/user`);
}

export async function queryMenuTree() {
  return request(`/${version}/pub/current/menutree`);
}

export async function organizations() {
  return request('/v2/pub/current/organs');
}

export async function createOrganization(data) {
  return request('/v2/org-organs', { method: methods.POST, data });
}

import axios from 'axios';
import dayjs from 'dayjs';
import { history } from 'umi';
import qs from 'qs';

import { notification } from 'antd';
import store, { storeKeys } from '@/utils/store';

let refreshTimeout;
let lastAccessTime;

export const baseURL = '/api';

export const contentType = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
};

export const headerKeys = {
  ContentType: 'Content-Type',
  Authorization: 'Authorization',
};

export const methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

// 获取访问令牌
export function getAccessToken() {
  const token = store.get(storeKeys.AccessToken);
  if (!token) {
    return '';
  }
  return token.access_token;
}

// 包装带有令牌的URL
export function wrapURLWithToken(url) {
  const ss = url.split('?');
  const query = qs.parse(ss[1]);
  query.accessToken = getAccessToken();
  return `${ss[0]}?${qs.stringify(query)}`;
}

// 登出
export function signOut() {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  store.remove(storeKeys.AccessToken);
  const { redirect } = qs.parse(window.location.href.split('?')[1]);
  if (window.location.pathname !== '/authen/signin' && !redirect) {
    history.replace({
      pathname: '/authen/signin',
      search: qs.stringify({
        redirect: window.location.href,
      }),
    });
  }
}

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// request 拦截器
function requestInterceptors(c) {
  const config = { ...c };
  const token = store.get(storeKeys.AccessToken);
  if (token) {
    config.headers[headerKeys.Authorization] = `${token.token_type} ${token.access_token}`;
  }
  return config;
}

instance.interceptors.request.use(requestInterceptors);

// ajax请求
export default function request(url, options = { method: methods.GET }) {
  const oldToken = store.get(storeKeys.AccessToken);
  if (oldToken && oldToken.expires_at - lastAccessTime <= 0) {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    signOut();
    // eslint-disable-next-line compat/compat
    return Promise.reject(new Error('The token has expired'));
  }
  lastAccessTime = dayjs().unix();

  const opts = { ...options };
  console.log(' o oo ==== opts: ', opts);

  let showNotify = true;
  if (opts.hideNotify) {
    showNotify = false;
    delete opts.hideNotify;
  }

  const config = {
    method: opts.method,
    baseURL,
    headers: {},
    paramsSerializer: (params) => qs.stringify(params),
    timeout: 60000,
    ...opts,
  };

  if (
    !(config.headers && config.headers[headerKeys.ContentType]) &&
    [methods.POST, methods.PUT, methods.PATCH].indexOf(config.method) > -1
  ) {
    config.headers[headerKeys.ContentType] = contentType.json;
  }

  return instance
    .request({ url, ...config })
    .then((res) => {
      const { data } = res;
      return data;
    })
    .catch((error) => {
      console.log(' ----- ddddd =error==== ', error);

      // const { response } = error;
      const { status, data } = error;
      console.log(' ----- ddddd ===== ', data);
      if (status === 401 && data.error && data.error.code === 9999) {
        signOut();
        return error;
      }

      if (showNotify) {
        let msg = '请求发生错误';
        if (status === 504) {
          msg = '未连接到服务器';
        } else if (data && data.error) {
          msg = data.error.message;
        }

        notification.error({
          message: `${config.baseURL}${url}`,
          description: msg,
        });
      }
      return error;
    });
}

// 放入访问令牌
export function setToken(token) {
  lastAccessTime = token.expires_at;
  store.set(storeKeys.AccessToken, token);
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  // 提前10分钟更新令牌
  const timeout = token.expires_at - dayjs().unix() - 10;
  if (timeout > 0) {
    refreshTimeout = setTimeout(() => {
      const oldToken = store.get(storeKeys.AccessToken);
      if (oldToken && oldToken.expires_at - lastAccessTime <= 0) {
        if (refreshTimeout) {
          clearTimeout(refreshTimeout);
        }
        return;
      }

      request('/v1/pub/refresh-token', {
        method: methods.POST,
      }).then((res) => {
        setToken(res);
      });
    }, timeout * 1000);
  }
}

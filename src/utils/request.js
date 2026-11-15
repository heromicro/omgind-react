import axios from 'axios';
import { history } from '@umijs/max';
import qs from 'qs';

import { notification } from 'antd';
import store, { storeKeys } from '@/utils/store';



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
  TokenRefresh.stop();
  store.remove(storeKeys.AccessToken);
  store.remove(storeKeys.MenuCache);
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
async function requestInterceptors(c) {
  if (!c.url.startsWith('/v2/pub/signin')) await TokenRefresh.ensureFresh();
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
      const { status, data } = error.response || {};
      console.log(' ----- ddddd ===== ', data);
      if (status === 401) {
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

// The backend renews a still-valid access token; expired tokens require sign-in.
class TokenRefresh {
  static timer;
  static pending;

  static stop() {
    clearTimeout(TokenRefresh.timer);
    TokenRefresh.timer = undefined;
  }

  static schedule(token, delay) {
    TokenRefresh.stop();
    const remaining = token.expires_at * 1000 - Date.now();
    if (remaining <= 0) return;
    const wait = delay ?? Math.max(1000, remaining - 60000);
    TokenRefresh.timer = setTimeout(() => {
      TokenRefresh.ensureFresh().catch(() => {
        const current = store.get(storeKeys.AccessToken);
        if (current) TokenRefresh.schedule(current, 15000);
      });
    }, Math.min(wait, 2147483647));
  }

  static async ensureFresh() {
    const token = store.get(storeKeys.AccessToken);
    if (!token) return;
    const remaining = token.expires_at * 1000 - Date.now();
    if (remaining <= 0) {
      signOut();
      throw new Error('The token has expired');
    }
    if (remaining > 60000) {
      TokenRefresh.schedule(token);
      return;
    }
    if (!TokenRefresh.pending) {
      TokenRefresh.pending = TokenRefresh.refresh(token).finally(() => {
        TokenRefresh.pending = undefined;
      });
    }
    await TokenRefresh.pending;
  }

  static async refresh(token) {
    try {
      // Use axios directly to avoid re-entering the request interceptor.
      const response = await axios.post(`${baseURL}/v2/pub/refresh-token`, {}, {
        headers: { Authorization: `${token.token_type} ${token.access_token}` },
        timeout: 10000,
      });
      const { code, burden } = response.data;
      if (code !== 0 || !burden?.access_token || !Number.isFinite(burden.expires_at)
        || burden.expires_at * 1000 <= Date.now()) {
        throw new Error('Invalid token refresh response');
      }
      const current = store.get(storeKeys.AccessToken);
      // A late response must not restore a signed-out or replaced session.
      if (current?.access_token === token.access_token) setToken(burden);
    } catch (error) {
      const current = store.get(storeKeys.AccessToken);
      if (error.response?.status === 401 && current?.access_token === token.access_token) signOut();
      throw error;
    }
  }
}

export function setToken(token) {
  store.set(storeKeys.AccessToken, token);
  TokenRefresh.schedule(token);
}

// Restore automatic renewal after a page reload.
const savedToken = store.get(storeKeys.AccessToken);
if (savedToken) TokenRefresh.schedule(savedToken);

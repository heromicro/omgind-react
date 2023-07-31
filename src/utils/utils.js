import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';

import * as _ from 'lodash';

// md5加密
export function md5Hash(value) {
  return md5(value);
}

// 创建UUID
export function newUUID() {
  return uuidv4();
}

export function fillFormKey(data) {
  if (!data) {
    return [];
  }
  return data.map((item) => {
    const nitem = { ...item };
    if (!nitem.key) {
      nitem.key = newUUID();
    }
    return nitem;
  });
}

export function parseValue(value, key) {
  if (!value) {
    return [];
  }
  return value.map((v) => v[key]);
}

// export function con
export function isRootUser(cuser) {
  return cuser.user_name === 'root';
}

export const defaultPagination = {
  current: 1,
  pageSize: 10,
  total: 0,
  after: '',
};

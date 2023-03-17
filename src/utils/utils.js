import md5 from 'md5';
import uuid from 'uuid/v4';
import * as _ from 'lodash';

// md5加密
export function md5Hash(value) {
  return md5(value);
}

// 创建UUID
export function newUUID() {
  return uuid();
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

export function genTreeNode(dataArr, parentId = null, isLeaf = false) {
  if (!dataArr) {
    return [];
  }
  let rd = [];
  for (let i = 0; i < dataArr.length; i += 1) {
    let data = dataArr[i];
    let oned = {
      id: data.id,
      pid: parentId,
      value: data.id,
      title: data.name,
      isLeaf,
      raw: data,
    };
    rd.push(oned);
  }
  return rd;
}

// export function con

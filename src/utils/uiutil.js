import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';

import * as lod from 'lodash';
import PButton from '@/components/PermButton';

export const showPButtons = (
  selectedRows,
  onAddClick,
  onItemEditClick,
  onItemDelClick,
  onItemEnableClick,
  onItemDisableClick
) => [
  <PButton code="add" key="add" type="primary" icon={<PlusOutlined />} onClick={() => onAddClick()}>
    新建
  </PButton>,
  selectedRows.length === 1 && (
    <PButton key="edit" code="edit" onClick={() => onItemEditClick(selectedRows[0])}>
      编辑
    </PButton>
  ),
  selectedRows.length === 1 && (
    <PButton
      key="del"
      code="del"
      danger
      type="primary"
      onClick={() => onItemDelClick(selectedRows[0])}
    >
      删除
    </PButton>
  ),
  // (selectedRows && ( selectedRows.length >= 1 || ( selectedRows.length === 1 && !selectedRows[0].is_active )) ) && (
  selectedRows.length === 1 && !selectedRows[0].is_active && (
    <PButton key="enable" code="enable" onClick={() => onItemEnableClick(selectedRows[0])}>
      启用
    </PButton>
  ),
  // ( selectedRows && (selectedRows.length >= 1 || ( selectedRows.length === 1 && selectedRows[0].is_active === true )) ) && (
  selectedRows.length === 1 && selectedRows[0].is_active === true && (
    <PButton
      key="disable"
      code="disable"
      danger
      onClick={() => onItemDisableClick(selectedRows[0])}
    >
      禁用
    </PButton>
  ),
];

export function adaptTreeSelect(data, key) {
  if (!data) {
    return [];
  }
  const newData = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = { ...data[i], title: data[i][key], value: data[i].id, key: data[i].id };
    if (item.children && item.children.length > 0) {
      item.children = adaptTreeSelect(item.children, key);
    }

    // console.log(' =+++++++ ', item);

    newData.push(item);
  }
  return newData;
}

export function listToTree(odata, ooptions) {
  let data = odata || [];
  let options = ooptions || {};
  let ID_KEY = options.idKey || 'id';
  let PARENT_KEY = options.parentKey || 'parent_id';
  let CHILDREN_KEY = options.childrenKey || 'children';

  let item;
  let id;
  let map = {};
  for (let i = 0; i < data.length; i += 1) {
    if (data[i][ID_KEY]) {
      map[data[i][ID_KEY]] = data[i];
      data[i][CHILDREN_KEY] = [];
    }
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i][PARENT_KEY]) {
      // is a child
      if (map[data[i][PARENT_KEY]]) {
        // for dirty data
        map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
        data.splice(i, 1); // remove from root
        i -= 1; // iterator correction
      } else {
        data[i][PARENT_KEY] = 0; // clean dirty data
      }
    }
  }
  return data;
}

export function plainDataToTree({
  plainArr = [],
  srcshow = 'name',
  srcval = 'id',
  srcpid = 'parent_id',
  destshow = 'title',
  destval = 'value',
  unselectables = [],
} = {}) {
  const treeData = [];
  if (!plainArr || !lod.isArray(plainArr) || plainArr.length === 0) {
    return treeData;
  }
  let tmpMap = {};

  for (let i = 0; i < plainArr.length; i += 1) {
    let itm = plainArr[i];
    itm.selectable = !unselectables.includes(itm.id);
    itm.disabled = unselectables.includes(itm.id);
    tmpMap[itm.id] = itm;
  }

  for (let i = 0; i < plainArr.length; i += 1) {
    let itm = plainArr[i];

    // console.log(`======== ------ ${itm.name}, selectable: ${itm.selectable}, disabled: ${itm.disabled}`);

    if (tmpMap[itm[srcpid]] && itm.id !== itm[srcpid]) {
      if (!tmpMap[itm[srcpid]].children) {
        tmpMap[plainArr[i][srcpid]].children = [];
      }
      if (tmpMap[itm[srcpid]]) {
        if (!tmpMap[itm[srcpid]].selectable) {
          // 如果上一级不可选, 所有的子级不可选
          itm.selectable = tmpMap[itm[srcpid]].selectable;
        }
        if (tmpMap[itm[srcpid]].disabled) {
          // 如果上一级disable, 所有的子级disable
          itm.disabled = tmpMap[itm[srcpid]].disabled;
        }
      }
      tmpMap[itm[srcpid]].children.push(itm);
    } else {
      treeData.push(itm);
    }
  }

  return treeData;
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

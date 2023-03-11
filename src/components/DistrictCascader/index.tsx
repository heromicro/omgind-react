import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import * as _ from 'lodash';

import * as districtService from '@/services/sysdistrict';

import { listToTree } from '@/utils/utils';

const DistrictCascader = (props) => {
  const [options, setOptions] = useState([]);
  const [pid] = useState('-');

  // 编辑页面默认要展示，所以要设置value
  // const [defaultValue, setDefaultValue] = useState([]);

  const getOptions = async (idStr: string) => {
    const params = { is_real: true, pid: idStr };
    const {
      burden: { list },
    } = await districtService.getSubstricts(idStr, params);
    const newData = [];
    list.map((item) => {
      return newData.push({
        ...item,
        label: item.name,
        value: item.id,
        isLeaf: item.is_leaf,
      });
    });
    setOptions(newData);
  };

  const queryOptions = async (id: string) => {
    const {
      burden: { top, subs },
    } = await districtService.queryTree(id);
    setOptions([]);

    console.log(' ------- qqq top  ------ top ', top);
    console.log(' ------- qqq subs  ------ subs ', subs);

    let alloptions = [];
    alloptions = alloptions.concat(top);
    alloptions = alloptions.concat(subs);
    console.log(' ------- qqq alloptions  ------ alloptions ', alloptions);

    let opts = listToTree(alloptions, { idKey: 'id', childrenKey: 'children', parentKey: 'pid' });

    // setOptions([...opts])
    let nd = [];
    opts.map((item) => {
      return nd.push({
        ...item,
        label: item.name,
        value: item.id,
        isLeaf: item.is_leaf,
      });
    });
    setOptions(nd);
    console.log(' ------- qqq os  ------ opts ', nd);
  };

  // 页面初始化请求一级目录
  useEffect(() => {
    const { value } = props;
    if (_.isEmpty(value)) {
      // getOptions('-');
      return;
    }

    // setDefaultValue(value)
    // getOptions('-');
    console.log(' ------- qqq qqqq  ------ value ', value);

    if (Array.isArray(value)) {
      console.log(' ------- ------ cascader value is array ');
      if (value.length > 0) {
        queryOptions(value[0]);
      }
    } else {
      console.log(' ------- ------ cascader value is not array ');
      if (value.includes('/')) {
        console.log(' ------- ------ cascader include / ');
      }
    }
  }, []);

  // 显示/隐藏浮层的回调
  const onDropdownVisibleChange = (open) => {
    const { value } = props;
    if (!value || open) {
      console.log(' ======= -- OOOOOOOO ', options);
      // getOptions(pid);
    }
  };

  // 点击目录事件
  const onCascaderChange = (value, selectedOptions) => {
    // setDefaultValue(value);
    const { onChange } = props;
    if (onChange) {
      console.log(' ----- ===== uuuuuuu ===== ');

      onChange({
        value,
        selectedOptions,
      });
    }
  };

  // 动态加载事件
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    let id = selectedOptions[selectedOptions.length - 1].value;
    const params = { is_real: true, pid: id };
    const {
      burden: { list },
    } = await districtService.getSubstricts(id, params);

    targetOption.loading = false;
    const newData = [];
    list.map((item) => {
      return newData.push({
        ...item,
        label: item.name,
        value: item.id,
        isLeaf: item.is_leaf,
      });
    });

    targetOption.children = newData;

    setOptions([...options]);
  };

  // console.log(' ------- qqq qqqq  ------ defaultValue ', defaultValue);

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={onCascaderChange}
      changeOnSelect
      allowClear
      placeholder="请选择"
      onDropdownVisibleChange={onDropdownVisibleChange}
      // defaultValue={props.defaultValue}
    />
  );
};

export default DistrictCascader;

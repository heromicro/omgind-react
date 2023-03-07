import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import * as _ from 'lodash';

import { getSubstricts } from '@/services/sysdistrict';

const DistrictCascader = (props) => {
  const [options, setOptions] = useState([]);
  const [pid] = useState('-');

  // 编辑页面默认要展示，所以要设置value
  const [defaultValue, setDefaultValue] = useState([]);

  const getOptions = async (idStr: string) => {
    const params = { is_real: true, pid: idStr };
    const { list, pagination } = await getSubstricts(idStr, params);
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

  // 页面初始化请求一级目录
  useEffect(() => {
    const {value} = props;
    if (_.isEmpty(value)) {
      return;
    }
    
    getOptions('-');
    if (Array.isArray(value) ){

    } else {
      if (value.includes("/")) {

      }
    }
  }, []);

  // 显示/隐藏浮层的回调
  const onDropdownVisibleChange = (open) => {
    const { value } = props;
    if (!value || open) {
      getOptions(pid);
    }
  };

  // 点击目录事件
  const onCascaderChange = (value, selectedOptions) => {

    setDefaultValue(value);
    const { onChange } = props;
    if (onChange) {
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
    const { list } = await getSubstricts(id, params);

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

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={onCascaderChange}
      changeOnSelect
      allowClear={false}
      onDropdownVisibleChange={onDropdownVisibleChange}
      value={defaultValue}
    />
  );
};

export default DistrictCascader;

import React from 'react';
import { Cascader } from 'antd';

import * as lod from 'lodash';

import * as districtService from '@/services/sysdistrict.svc';

import { listToTree } from '@/utils/uiutil';

type onChangeFunc = (value, selectedOptions) => void;

class DistrictCascader extends React.PureComponent<
  { value: string[]; onChange: onChangeFunc },
  { options: []; defaultValue: string[]; svalue: string[] }
> {
  //
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      defaultValue: [],
      svalue: props.value || [],
    };
    this.triggerChange = lod.debounce(this.triggerChange.bind(this), 300);
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        // dataSource: fillFormKey(nextProps.value),
        value: nextProps.value,
      };
    }
    return state;
  }

  queryOptions = async (id, dvalue) => {
    const {
      burden: { top, subs },
    } = await districtService.queryTree(id);

    // console.log(' ------- qqq top  ------ top ', top);
    // console.log(' ------- qqq subs  ------ subs ', subs);

    let alloptions = [];
    alloptions = alloptions.concat(top);
    alloptions = alloptions.concat(subs);
    // console.log(' ------- qqq alloptions  ------ alloptions ', alloptions);

    let nd = [];
    alloptions.map((item) => {
      return nd.push({
        ...item,
        label: item.name,
        value: item.id,
        isLeaf: item.is_leaf,
      });
    });

    let opts = listToTree(nd, { idKey: 'id', childrenKey: 'children', parentKey: 'pid' });

    this.setState({
      options: opts,
      svalue: dvalue,
    });

    // console.log(' ----- -- qqq os  ------ opts ', opts);
  };

  componentDidMount() {
    const { svalue } = this.state;

    if (lod.isEmpty(svalue)) {
      this.getOptions('-');
      return;
    }

    console.log(' ------- qqq qqqq  ------ value ', svalue);

    if (Array.isArray(svalue)) {
      console.log(' ------- ------ cascader value is array ');
      if (svalue.length > 0) {
        this.queryOptions(svalue[0], svalue);
      }
      this.setState({
        defaultValue: svalue,
      });
    } else {
      console.log(' ------- ------ cascader value is not array ');
      // let pids = value.split('/');
      // this.setState({
      //   defaultValue: pids,
      // });
    }
  }

  getOptions = async (idStr: string) => {
    const params = { is_real: true, pid: idStr };
    const {
      burden: { list },
    } = await districtService.getSubs(idStr, params);
    const newData = [];
    list.map((item) => {
      return newData.push({
        ...item,
        label: item.name,
        value: item.id,
        isLeaf: item.is_leaf,
      });
    });

    this.setState({
      options: newData,
    });
  };

  // 显示/隐藏浮层的回调
  onDropdownVisibleChange = (open) => {
    const { value } = this.props;
    console.log(' ======= -- OOOOOOO value O ', value);

    if (!value && open) {
      // const { options } = this.state;
      // console.log(' ======= -- OOOOOOOO ', options);
      this.getOptions('-');
    }
  };

  // 点击目录事件
  onCascaderChange = (value, selectedOptions) => {
    console.log(' ----- === ----- ==== value: ', value);
    console.log(' ----- === ----- ==== selectedOptions: ', selectedOptions);
    this.setState({
      svalue: value,
    });
    this.triggerChange(value, selectedOptions);
  };

  onCascaderClear = () => {
    this.setState({
      svalue: [],
    });
    this.triggerChange([], []);
  };

  triggerChange = (value, selectedOptions) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, selectedOptions);
    }
  };

  // 动态加载事件
  loadData = async (selectedOptions) => {
    const { options } = this.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    let id = selectedOptions[selectedOptions.length - 1].value;
    const params = { is_real: true, pid: id };
    const {
      burden: { list },
    } = await districtService.getSubs(id, params);

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

    // setOptions([...options]);
    this.setState({
      options: [...options],
    });
  };

  render() {
    const { svalue, options, defaultValue } = this.state;

    return (
      <Cascader
        options={options}
        loadData={this.loadData}
        onChange={this.onCascaderChange}
        changeOnSelect
        allowClear
        placeholder="请选择"
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        value={svalue}
        defaultValue={defaultValue}
        onClear={this.onCascaderClear}
      />
    );
  }
}

export default DistrictCascader;

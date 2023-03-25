import React from 'react';
import { Cascader, CascaderProps } from 'antd';
import * as _ from 'lodash';

import * as deptService from '@/services/orgdept';

import { listToTree } from '@/utils/uiutil';

// type onChangeFunc = (value, selectedOptions) => void;

type DeptCascaderProps = CascaderProps & {
  orgId?: string;
  // debounceTimeOut?: number;
};

interface DeptCascaderState {
  options: [];
  defaultValue: string[];
  svalue: string[];
  orgId: string;
}

const defaultProps: DeptCascaderProps = { orgId: null };

class DeptCascader extends React.PureComponent<DeptCascaderProps, DeptCascaderState> {
  //
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      defaultValue: [],
      svalue: props.value || [],
      orgId: props.orgId || '',
    };

    this.triggerChange = _.debounce(this.triggerChange.bind(this), 300);
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        // dataSource: fillFormKey(nextProps.value),
        value: nextProps.value,
      };
    }
    if ('orgId' in nextProps) {
      // console.log(' ---- ===== ----- ==== nextProps.orgId ', nextProps.orgId);
      return {
        ...state,
        orgId: nextProps.orgId,
      };
    }

    return state;
  }

  componentDidMount() {
    const { svalue } = this.state;
    const { orgId } = this.props;

    if (!orgId) {
      return;
    }

    if (_.isEmpty(svalue)) {
      this.getOptions('-', orgId);
      return;
    }

    console.log(' ------- aaaaaaa  ------ value ', svalue);

    if (Array.isArray(svalue)) {
      console.log(' ------- ------ cascader value is array ');

      if (svalue.length > 0) {
        this.queryOptions(svalue[0], orgId, svalue);
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

  componentDidUpdate(prevProps, prevState) {
    // console.log(' -- --- - = ---- ===prevProps= ', prevProps);
    // console.log(' -- --- - = ---- ===prevState= ', prevState);
    const { orgId } = this.props;

    if (prevProps.orgId !== orgId) {
      // console.log(' ------ = ---- wwww ==== ', prevProps.orgId);
      // console.log(' ------ = ---- wwww ==== ', orgId);

      this.setState({
        options: [],
        svalue: [],
        defaultValue: [],
        orgId,
      });
      if (orgId) {
        this.getOptions('-', orgId);
      }
    }
  }

  queryOptions = async (id, orgId, dvalue) => {
    const params = { org_id: orgId };

    const { burden } = await deptService.queryTree(id, params);
    if (!burden) {
      return;
    }
    const { top, subs } = burden;

    console.log(' ------- qqq top  ------ top ', top);
    console.log(' ------- qqq subs  ------ subs ', subs);

    let alloptions = [];
    alloptions = alloptions.concat(top);
    alloptions = alloptions.concat(subs);
    console.log(' ------- qqq alloptions  ------ alloptions ', alloptions);

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

    console.log(' ------- qqq os  ------ opts ', opts);
  };
  
  getOptions = async (idStr: string, orgId: string) => {
    console.log(' ------ ===== orgId ', orgId);
    console.log(' ------ ===== idStr ', idStr);

    if (!orgId) {
      return;
    }

    const params = { pid: idStr, org_id: orgId };

    const { burden } = await deptService.getSubs(idStr, params);
    if (!burden) {
      return;
    }
    const { list } = burden;
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
    if (!open) {
      return;
    }
    const { value, orgId } = this.props;
    if (!orgId) {
      return;
    }
    if (!value) {
      // console.log(' ======= -- OOOOOOO value O value ', value);
      // console.log(' ======= -- OOOOOOO value O orgId ', orgId);
      // const { options } = this.state;
      // console.log(' ======= -- OOOOOOOO ', options);
      this.getOptions('-', orgId);
      //
    }
  };

  // 点击目录事件
  onCascaderChange = (value, selectedOptions) => {
    // console.log(' ----- === ----- ==== value: ', value);
    // console.log(' ----- === ----- ==== selectedOptions: ', selectedOptions);
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
    const { orgId } = this.props;

    if (!orgId) {
      return;
    }
    const { options } = this.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.loading = true;

    let id = selectedOptions[selectedOptions.length - 1].value;
    // const params = { is_real: true, pid: id, org_id: orgId };
    const params = { is_real: true, org_id: orgId };
    const { burden } = await deptService.getSubs(id, params);

    targetOption.loading = false;

    if (!burden) {
      return;
    }
    const { list } = burden;
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
    const { ...restProps } = this.props;
    const { svalue, options, defaultValue } = this.state;

    return (
      <Cascader
        {...restProps}
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

DeptCascader.defaultProps = defaultProps;

export default DeptCascader;

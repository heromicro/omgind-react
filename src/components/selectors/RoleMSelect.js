import React, { PureComponent } from 'react';
import { Select } from 'antd';
import debounce from 'lodash/debounce';

import * as lod from 'lodash';

import * as roleService from '@/services/sysrole.svc';

import * as utils from '@/utils/utils';

export default class RoleSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      notImmediately: props.notImmediately === undefined ? true : props.notImmediately,
      value: utils.parseValue(props.value, 'role_id'),
      data: [],
      pagination: utils.defaultPagination,
    };

    this.handleSearch = debounce(this.handleSearch, 1200);
  }

  componentDidMount() {
    const { notImmediately, value } = this.state;
    if (!notImmediately || !lod.isEmpty(value)) {
      this.queryRole({});
    }
  }

  queryRole = ({ qv = null, qp = {} }) => {
    const { pagination } = this.state;
    const { assetPermsNotIn } = this.props;

    const { value } = this.state;
    let muinIDs = '';
    if (!lod.isEmpty(value)) {
      muinIDs = value.join(',');
    }

    let params = { ...qp };

    if (lod.isEmpty(muinIDs)) {
      params = { ...params };
    }
    const { queryParams } = this.props;

    if (queryParams) {
      params = { ...params, ...queryParams };
    }

    roleService
      .querySelectPage({
        q: qv,
        // eslint-disable-next-line camelcase
        current: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((data) => {
        // console.log(' - ----- ==== = burden: ', data.burden);
        const { code, burden } = data;
        if (code !== 0) {
          return;
        }

        if (!burden.list) {
          this.setState({
            data: [],
            pagination: utils.defaultPagination,
          });
          return;
        }

        this.setState({
          data: burden.list || [],
          pagination: burden.pagination || utils.defaultPagination,
        });
      });

    // //
  };

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, value: utils.parseValue(nextProps.value, 'role_id') };
    }
    return state;
  }

  handleChange = (value) => {
    this.setState({ value });
    this.triggerChange(value);
  };

  triggerChange = (data) => {
    const { onChange } = this.props;
    if (onChange) {
      const newData = data.map((v) => ({ role_id: v }));
      onChange(newData);
    }
  };

  onDropdownVisibleChange = (open) => {
    if (!open) {
      return;
    }
    const { data } = this.state;
    if (data && data.length > 0) {
      return;
    }

    this.queryRole({});
  };

  handleSearch = (besearched) => {
    // console.log(' ----- === handleSearch: ', besearched);
    if (!besearched) {
      return;
    }
    this.queryRole({ qv: besearched });
  };

  render() {
    const { value, data } = this.state;

    return (
      <Select
        mode="tags"
        value={value}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        placeholder="请选择角色"
        style={{ minWidth: '100px' }}
      >
        {data.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

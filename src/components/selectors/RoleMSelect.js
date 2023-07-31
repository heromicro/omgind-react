import React, { PureComponent } from 'react';
import { Select } from 'antd';
import * as roleService from '@/services/sysrole';

import * as utils from '@/utils/utils';

function parseValue(value) {
  if (!value) {
    return [];
  }
  return value.map((v) => v.role_id);
}

export default class RoleSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: parseValue(props.value),
      data: [],
      pagination: utils.defaultPagination,
    };
  }

  componentDidMount() {
    this.queryRole();
  }

  queryRole = (qv = null) => {
    const { pagination } = this.state;
    const { assetPermsNotIn } = this.props;

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
      return { ...state, value: parseValue(nextProps.value) };
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

  handleSearch = (val) => {
    // console.log(' ----- === handleSearch: ', val);
    if (!val) {
      return;
    }
    this.queryRole(val);
  };

  render() {
    const { value, data } = this.state;

    return (
      <Select
        mode="tags"
        value={value}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
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

import React, { PureComponent } from 'react';
import { Select, SelectProps } from 'antd';

import * as lod from 'lodash';

import * as orgService from '@/services/orgorgan.svc';

interface OrganSelectorProps extends SelectProps {
  debounceTimeOut?: number;
  // onChange?: (value, option) => void;
}

interface OrganSelectorState {
  value: string;
  options: [];
}

const defaultProps: OrganSelectorProps = { debounceTimeOut: 400 };

class OrganSelector extends PureComponent<OrganSelectorProps, OrganSelectorState> {
  //
  // static defaultProps: OrganSelectorProps = { debounceTimeOut: 800 };

  constructor(props: OrganSelectorProps) {
    super(props);
    this.state = {
      value: props.value,
      options: [],
    };
    console.log(' ---------- 0s s  debounceTimeOut   ', props.debounceTimeOut);

    this.onSearch = lod.debounce(this.onSearch.bind(this), props.debounceTimeOut);

    this.triggerChange = lod.debounce(this.triggerChange.bind(this), 300);
  }

  componentDidMount(): void {
    this.onSearch('');
  }

  onSearch = (value) => {
    console.log(' --- --- ===== === value: ', value);
    orgService.querySelect({ q: value }).then((res) => {
      const { burden } = res;
      if (burden && burden.list) {
        console.log(' --- --- ===== === burden: ', burden.list);

        let nd = [];
        burden.list.map((item) => {
          return nd.push({
            ...item,
            label: item.name,
            value: item.id,
          });
        });
        this.setState({ options: nd });
      }
    });
  };

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        value: nextProps.value,
      };
    }
    return state;
  }

  onChange = (value: string, option) => {
    this.triggerChange(value, option);
  };

  onSelect = (value: string, option) => {
    this.triggerChange(value, option);
  };

  triggerChange = (value, option) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, option);
    }
  };

  render() {
    //
    const { ...restProps } = this.props;
    const { value, options, defaultValue } = this.state;

    return (
      <Select
        {...restProps}
        showSearch
        // fieldNames={{ value: 'id', label: 'name', options: 'sname' }}
        onSearch={(val) => {
          this.onSearch(val);
        }}
        // defaultValue={defaultValue}
        onChange={(val, option) => {
          this.onChange(val, option);
        }}
        onSelect={(val, option) => {
          this.onSelect(val, option);
        }}
        options={options}
        value={value}
      />
    );
  }
}

OrganSelector.defaultProps = defaultProps;

export default OrganSelector;

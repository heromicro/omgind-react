import React, { PureComponent } from 'react';
import { Select } from 'antd';
import * as _ from 'lodash';

import * as orgService from '@/services/orgorgan';

function parseValue(value) {
  console.log(' ---- =====; ffff === --- ', value);
  if (!value) {
    return [];
  }
  return value.map((v) => v.id);
}

interface OrganSelectorProps {
  mode?: 'combobox' | 'multiple' | 'tags';
  debounceTimeOut?: number;
  value?: string;
  onChange?: (value, option) => void;
  defaultValue?: any;
}

interface OrganSelectorState {
  value: string;
  options: [];
}

const defaultProps: OrganSelectorProps = { debounceTimeOut: 800 };

class OrganSelector extends React.Component<OrganSelectorProps, OrganSelectorState> {
  //

  constructor(props: OrganSelectorProps) {
    super(props);
    this.state = {
      value: props.value,
      options: [],
    };
    console.log(' ---------- 0s s  debounceTimeOut   ', props.debounceTimeOut);

    this.onSearch = _.debounce(this.onSearch.bind(this), props.debounceTimeOut);
  }

  componentDidMount(): void {
    this.onSearch('');
  }

  onSearch = (value) => {
    console.log(' --- --- ===== === value: ', value);
    orgService.querySelect({ queryValue: value }).then((res) => {
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

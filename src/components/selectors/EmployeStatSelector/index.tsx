import React, { PureComponent } from 'react';
import { Select, SelectProps } from 'antd';
import * as _ from 'lodash';
import * as dictService from '@/services/sysdict';

interface EmployeStatSelectorProps extends SelectProps {
  dictId?: string;
  debounceTimeOut?: number;
  onChange?: (value, option) => void;
}

interface EmployeStatSelectorState {
  value: string;
  options: [];
  dictId?: string;
}
const defaultProps: EmployeStatSelectorProps = { debounceTimeOut: 400, dictId: '-' };

class EmployeStatSelector extends PureComponent<
  EmployeStatSelectorProps,
  EmployeStatSelectorState
> {
  //

  constructor(props: EmployeStatSelectorProps) {
    super(props);
    this.state = {
      value: props.value,
      options: [],
      dictId: props.dictId,
    };

    this.fetchDictItems = _.debounce(this.fetchDictItems.bind(this), props.debounceTimeOut);
    this.triggerChange = _.debounce(this.triggerChange.bind(this), 300);
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        value: nextProps.value,
      };
    }
    return state;
  }

  componentDidMount(): void {
    const { dictId } = this.props;

    this.fetchDictItems(dictId ? dictId : '-');
  }

  fetchDictItems = (did: string) => {
    dictService.items(did, { name_en: 'employemnt stat' }).then((res) => {
      const { code, burden } = res;
      if (code === 0 && burden.length > 0) {
        let gender = burden[0];
        // console.log(' ---- --- --- ==== emp stat = ', gender);
        if (gender.items.length > 0) {
          let nd = [];
          gender.items.map((item) => {
            return nd.push({
              ...item,
            });
          });
          this.setState({
            options: nd,
          });
        }
      } else {
      }
    });
  };

  onChange = (value: string, option) => {
    this.triggerChange(value, option);
  };

  onSelect = (value: string, option) => {
    this.triggerChange(value, option);
  };

  triggerChange = (value, option) => {
    const { onChange } = this.props;
    if (onChange) {
      // console.log(' ------- ===== ----- ', option);
      onChange(value, option);
    }
  };

  render() {
    const { ...restProps } = this.props;
    const { value, options } = this.state;

    return (
      <Select
        {...restProps}
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

EmployeStatSelector.defaultProps = defaultProps;

export default EmployeStatSelector;

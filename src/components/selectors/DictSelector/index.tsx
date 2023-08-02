import React, { PureComponent } from 'react';
import { Select, SelectProps } from 'antd';
import * as _ from 'lodash';
import * as dictService from '@/services/sysdict';

interface DictSelectorProps extends SelectProps {
  dictId?: string;
  dictKey: string;
  debounceTimeOut?: number;
  // onChange?: (value, option) => void;
}

interface DictSelectorState {
  value: string;
  options: [];
  dictId?: string;
  dictKey: string;
}
const defaultProps: DictSelectorProps = { debounceTimeOut: 400, dictId: '-' };

class DictSelector extends PureComponent<DictSelectorProps, DictSelectorState> {
  //

  constructor(props: DictSelectorProps) {
    super(props);

    console.log(' ---- ======= value : ', props.value);

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
    const { dictId, dictKey } = this.props;

    this.fetchDictItems(dictId ? dictId : '-', dictKey);
  }

  fetchDictItems = (did: string, dictKey: string) => {
    dictService.items(did, { dict_key: dictKey }).then((res) => {
      const { code, burden } = res;
      if (code === 0 && burden.length > 0) {
        let gender = burden[0];
        console.log(' ---- --- --- ==== simulation_vendor = ', dictKey);
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
    let val = { label: option.label, value };
    this.triggerChange(val, option);
  };

  onSelect = (value: string, option) => {
    console.log(' ------- === option == ----- ', option);
    let val = { label: option.label, value };
    this.triggerChange(val, option);
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

DictSelector.defaultProps = defaultProps;

export default DictSelector;

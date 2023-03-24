import React, { PureComponent } from 'react';
import { Select, SelectProps } from 'antd';
import * as _ from 'lodash';
import * as dictService from '@/services/sysdict';

interface GenderSelectorProps extends SelectProps {
  dictId?: string;
  debounceTimeOut?: number;
  // onChange?: (value, option) => void;
}

interface GenderSelectorState {
  value: string;
  options: [];
  dictId?: string;
}
const defaultProps: GenderSelectorProps = { debounceTimeOut: 400, dictId: '-' };

class GenderSelector extends PureComponent<GenderSelectorProps, GenderSelectorState> {
  //

  constructor(props: GenderSelectorProps) {
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
    dictService.items(did, { name_en: 'gender' }).then((res) => {
      const { code, burden } = res;
      if (code === 0 && burden.length > 0) {
        let gender = burden[0];
        console.log(' ---- --- --- ==== gender = ', gender);
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

GenderSelector.defaultProps = defaultProps;

export default GenderSelector;

import React from 'react';

import { Cascader } from 'antd';

import { getSubstricts } from '@/services/sysdistrict';


export default class DistrictCascader extends React.PureComponent {

  static getDerivedStateFromProps(nextProps) {

    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    
    this.setState({
        value: props.value,
        options: [],
    })

  }

  componentDidMount() {

    getSubstricts('-', {is_real: true}).then((data) => {
        console.log(" ----- === ------- ===== ", data);
        const {list } = data;
        this.setState({
            options: list,
        });

    });

  }

  loadData = (selectedOptions:[]) => {
    
    if (selectedOptions.length > 0) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log(" ----- === ------- ===== targetOption.id ", targetOption.id);
        const {options} = this.state;

        getSubstricts(targetOption.id, {is_real: true}).then((data) => {
            targetOption.loading = false;
            const { list } = data;
            console.log(" ----- === ------- ===== data ", data);
            console.log(" ----- === ------- ===== list ", list);

            targetOption.children = list;
            
            this.setState({
                options
            })

        });

    } else {

    }

  }

  onCascaderChange = (value, selectOptions:[]) => {

     this.triggerChange(value, selectOptions);
  }

  triggerChange = (value, selectOptions:[]) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, selectOptions);
    }
  };

  render() {
    const { ...restProps } = this.props;
    const { options } = this.state;

    return <Cascader options={options} loadData={this.loadData} onChange={this.onCascaderChange} changeOnSelect {...restProps} />;
  }
}

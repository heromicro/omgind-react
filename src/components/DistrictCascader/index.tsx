import React, { useEffect, useState } from 'react';

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
      
      this.state = {
          value: props.value,
          options: [],
      }
  
    }
  
    componentDidMount() {
  
      getSubstricts('-', {is_real: true}).then(data => {
          console.log(" ----- === ------- ===== ", data);
          const {list } = data;
  
          this.setState({
              options: list.map(item => {
                  return {...item, label:item.name, value:item.id}
              }),
          });
  
      });
  
    }
  
    loadData = async (selectedOptions:[]) => {
      
      if (selectedOptions.length > 0) {
          const targetOption = selectedOptions[selectedOptions.length - 1];
          targetOption.loading = true;
          console.log(" ----- === ------- ===== targetOption.id ", targetOption.id);
          // const {options} = this.state;
          let data = await getSubstricts(targetOption.id, {is_real: true})
          console.log(" ----- === ------- =====  data  ",data );
          const { list } = data;
  
          targetOption.children = list.map(item => {
              return {...item, label:item.name, value:item.id}
          });
          targetOption.loading = false;
          
          // this.setState({
          //     options
          // })
          // console.log(" ----- === ------- =====  options  ", options );
  
          // getSubstricts(targetOption.id, {is_real: true}).then((data) => {
          //     const { list } = data;
          //     console.log(" ----- === ------- ===== data ", data);
          //     console.log(" ----- === ------- ===== list ", list);
  
          //     // targetOption.children = list;
              
          //     // this.setState({
          //     //     options
          //     // })
  
          //     targetOption.loading = false;
  
          // });
  
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
  
      // const { ...restProps } = this.props;
      const { options } = this.state;
  
      return <Cascader options={options} loadData={this.loadData} onChange={this.onCascaderChange} changeOnSelect  />;
    }
  }
  
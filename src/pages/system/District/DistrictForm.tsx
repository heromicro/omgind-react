import exp from 'constants';
import React from 'react';
import { connect } from 'dva';

import { Form, Input, Switch } from 'antd';
import { ProForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-components';

import { SysDistrctItem } from '@/scheme/sysdistrict';
import DistrictCascader from '@/components/DistrictCascader';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictForm extends React.PureComponent {
  formRef = React.createRef();

  // constructor(props) {
  //     super(props);
  // }

  onFinish = (formData) => {
    const { onSubmit } = this.props;
    console.log(' ----- === formData :', formData);
    onSubmit(formData);
    return false;
  };

  render() {
    const { sysdistrict } = this.props;
    const { formData, submitting } = sysdistrict;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <ProForm<SysDistrctItem>
        ref={this.formRef}
        disabled={!submitting}
        layout='vertical'
        initialValues={{
          ...formData,
          is_active: formData.statuis_actives === undefined ? true : formData.is_active,
        }}
      >
        <Form.Item
          {...formItemLayout}
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }, {}]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="名称[英语]"
          name="name"
          rules={[{ required: true, message: '请输入名称[英语]' }]}
        >
          <Input placeholder="请输入名称[英语]" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="短名称"
          name="sname"
          rules={[{ required: true, message: '请输入短名称' }, {}]}
        >
          <Input placeholder="请输入短名称" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="短名称[英语]"
          name="sname"
          rules={[{ required: true, message: '请输入短名称[英语]' }]}
        >
          <Input placeholder="请输入短名称[英语]" />
        </Form.Item>
        

        <Form.Item 
          {...formItemLayout}
          label="上级"
          name="pid"
        >
            <DistrictCascader />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="短简称"
          name="abbr"
          rules={[{ required: true, message: '请输入简称' }, {}]}
        >
          <Input placeholder="请输入简称" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="行政名称"
          name="merge_name"
          rules={[{ required: true, message: '行政名称' }, {}]}
        >
          <Input placeholder="请输入行政名称" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="行政短名称"
          name="merge_sname"
          rules={[{ required: false, message: '行政短名称' }]}
        >
          <Input placeholder="请输入行政短名称" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="行政后缀"
          name="merge_sname"
          rules={[{ required: false, message: '行政后缀' }]}
        >
          <Input placeholder="请输入行政后缀" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="拼音"
          name="pinyin"
          rules={[{ required: false, message: '拼音' }]}
        >
          <Input placeholder="请输入拼音" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="简拼"
          name="initials"
          rules={[{ required: false, message: '简拼' }]}
        >
          <Input placeholder="请输入简拼" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="区号"
          name="area_code"
          rules={[{ required: false, message: '区号' }]}
        >
          <Input placeholder="请输入区号" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="邮码"
          name="zip_code"
          rules={[{ required: false, message: '邮码' }]}
        >
          <Input placeholder="请输入邮码" />
        </Form.Item>


        <Form.Item {...formItemLayout} label="状态" name="is_active">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否主要" name="is_main">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否真实" name="is_real">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否热点" name="is_hot">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否直辖" name="is_direct">
          <Switch defaultChecked />
        </Form.Item>

      </ProForm>
    );
  }
}

export default DistrictForm;

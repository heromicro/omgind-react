import React, { forwardRef } from 'react';
import { connect } from 'dva';

import { Form, Input, Switch, Row, Col } from 'antd';
import { ProForm, ProFormGroup, ProFormDatePicker, ProFormText } from '@ant-design/pro-components';

import { SysDistrctItem } from '@/scheme/sysdistrict';
import DistrictCascader from '@/components/cascader/DistrictCascader';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictForm extends React.PureComponent {
  // formRef = React.createRef();

  constructor(props) {
    super(props);
  }

  onFinish = (formData) => {
    const { onSubmit } = this.props;
    console.log(' ----- === formData :', formData);
    onSubmit(formData);
    return false;
  };

  onDistrictChange = (value, selectedOptions) => {
    console.log(' ------ ==== -- ===== value ', value);
    console.log(' ------ ==== -- ===== selectedOptions ', selectedOptions);
  };

  render() {
    const { sysdistrict, formRef, ...restProps } = this.props;
    const { formData, submitting } = sysdistrict;

    console.log(' ------ ======== submitting ', submitting);
    console.log(' ----- === formData == == ', formData);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 23 },
      },
    };

    return (
      <Form
        ref={formRef}
        layout="vertical"
        {...formItemLayout}
        disabled={submitting}
        initialValues={{
          ...formData,
          is_active: formData.statuis_actives === undefined ? true : formData.is_active,
        }}
        {...restProps}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="名称"
              name="name"
              rules={[
                { required: true, message: '请输入名称' },
                { max: 128, message: '最多 128 字符' },
              ]}
            >
              <Input placeholder="请输入名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="名称[英语]"
              name="name_en"
              rules={[{ max: 128, message: '最多 128 字符' }]}
            >
              <Input placeholder="请输入名称[英语]" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="短名称" name="sname" rules={[{ max: 64, message: '最多 64 字符' }]}>
              <Input placeholder="请输入短名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="短名称[英语]"
              name="sname_en"
              rules={[{ max: 64, message: '最多 64 字符' }]}
            >
              <Input placeholder="请输入短名称[英语]" allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item label="上级" name="pid">
              <DistrictCascader onChange={this.onDistrictChange} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="短简称" name="abbr" rules={[{ max: 16, message: '最多 16 字符' }]}>
              <Input placeholder="请输入简称" allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              label="行政名称"
              name="merge_name"
              rules={[{ max: 256, message: '最多 256 字符' }]}
            >
              <Input placeholder="请输入行政名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="行政短名称"
              name="merge_sname"
              rules={[{ max: 256, message: '最多 256 字符' }]}
            >
              <Input placeholder="请输入行政短名称" allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              label="行政后缀"
              name="suffix"
              rules={[{ max: 32, message: '最多 32 字符' }]}
            >
              <Input placeholder="请输入行政后缀" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="拼音" name="pinyin" rules={[{ max: 128, message: '最多 128 字符' }]}>
              <Input placeholder="请输入拼音" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="简拼" name="initials" rules={[{ max: 32, message: '最多 32 字符' }]}>
              <Input placeholder="请输入简拼" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="区号" name="area_code" rules={[{ max: 8, message: '最多 8 字符' }]}>
              <Input placeholder="请输入区号" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="邮码" name="zip_code" rules={[{ max: 8, message: '最多 8 字符' }]}>
              <Input placeholder="请输入邮码" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="状态" name="is_active">
              <Switch defaultChecked />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="是否主要" name="is_main">
              <Switch />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="是否真实" name="is_real">
              <Switch defaultChecked />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="是否热点" name="is_hot">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row></Row> */}
        <Row>
          <Col span={6}>
            <Form.Item label="是否直辖" name="is_direct">
              <Switch />
            </Form.Item>
          </Col>
          {/* <Col span={6}></Col> */}
        </Row>
      </Form>
    );
  }
}

export default forwardRef((props, ref) => <DistrictForm {...props} innerRef={ref} />);

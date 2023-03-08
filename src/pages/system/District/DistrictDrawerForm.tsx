import React from 'react';
import {
  DrawerForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Switch, message, Input, Row, Col } from 'antd';

import { connect } from 'dva';
import * as _ from 'lodash';

import DistrictCascader from '@/components/DistrictCascader';
import { SysDistrctItem } from '@/scheme/sysdistrict';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictDrawerForm extends React.Component {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinish = (formData) => {
    console.log(' ======== === 0000 formData : ', formData);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    const { onSubmit } = this.props;
    const {
      pid: { value },
    } = formData;

    console.log(' ---- == dd value ', value);

    if (value && value.length > 0) {
      formData.pid = value[value.length - 1];
    } else {
      formData.pid = null;
    }

    console.log(' ======== === 1111 formData : ', formData);

    onSubmit(formData);

    return true;
  };

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'sysdistrict/changeFormDrawerOpen',
      payload: false,
    });
  };

  onDistrictChange = (value, selectedOptions) => {
    console.log(' ------ ==== -- ===== value ', value);
    console.log(' ------ ==== -- ===== selectedOptions ', selectedOptions);
  };

  render() {
    const {
      sysdistrict: { formTitle, formVisible, formDrawerOpen, formData, submitting },
    } = this.props;

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

    console.log(' ---- ====== ==== formDrawerOpen ', formDrawerOpen);
    console.log(' ---- ====== ==== formData ', formData);

    return (
      <DrawerForm<SysDistrctItem>
        title={_.isEmpty(formData) ? formTitle : `${formTitle}--${formData.name}`}
        formRef={this.formRef}
        open={formDrawerOpen}
        autoFocusFirstInput
        {...formItemLayout}
        drawerProps={{
          destroyOnClose: true,
          onClose: this.onClose,
          maskClosable: false,
        }}
        initialValues={{
          ...formData,
          is_active: formData.is_active === undefined ? true : formData.is_active,
          is_main: formData.is_main === undefined ? false : formData.is_main,
          is_real: formData.is_real === undefined ? true : formData.is_real,
          is_hot: formData.is_hot === undefined ? false : formData.is_hot,
          is_direct: formData.is_direct === undefined ? false : formData.is_direct,
        }}
        readonly={submitting}
        confirmloading={submitting}
        onFinish={this.onFinish}
      >
        {
          !_.isEmpty(formData) && (
            <>
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
                  <Form.Item
                    label="短名称"
                    name="sname"
                    rules={[{ max: 64, message: '最多 64 字符' }]}
                  >
                    <Input placeholder="请输入短名称" allowClear />
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
                  <Form.Item
                    label="简称"
                    name="abbr"
                    rules={[{ max: 16, message: '最多 16 字符' }]}
                  >
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
                  <Form.Item
                    label="拼音"
                    name="pinyin"
                    rules={[{ max: 128, message: '最多 128 字符' }]}
                  >
                    <Input placeholder="请输入拼音" allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="简拼"
                    name="initials"
                    rules={[{ max: 32, message: '最多 32 字符' }]}
                  >
                    <Input placeholder="请输入简拼" allowClear />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="区号"
                    name="area_code"
                    rules={[{ max: 8, message: '最多 8 字符' }]}
                  >
                    <Input placeholder="请输入区号" allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="邮码"
                    name="zip_code"
                    rules={[{ max: 8, message: '最多 8 字符' }]}
                  >
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

              <Row>
                <Col span={6}>
                  <Form.Item label="是否直辖" name="is_direct">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>
            </>
          )
        }
      </DrawerForm>
    );
  }
}

export default DistrictDrawerForm;

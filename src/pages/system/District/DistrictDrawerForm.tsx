import React from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Button, Switch, message, Drawer, Input, Space, Row, Col } from 'antd';
import { SaveFilled } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';
import PButton from '@/components/PermButton';

import DistrictCascader from '@/components/cascader/DistrictCascader';

import { SysDistrctItem } from '@/scheme/sysdistrict.sch';

import styles from './DistrictDetail.less';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictDrawerForm extends React.PureComponent {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
  };

  onFinish = (data) => {
    // console.log(' ======== === 0000 data : ', data);
    // console.log(' ======== === 0000 data : ', data.pids);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    let formData = data;
    const { onSubmit } = this.props;
    if (formData.pids) {
      delete formData.pids;
    }

    console.log(' ======= = === 1111 formData : ', formData);

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

  onDistrictParentChange = (value, selectedOptions) => {
    console.log(' --- --- = === -- == === value ', value);
    console.log(' --- --- ==== -- ==== = selectedOptions ', selectedOptions);
    if (value && value.length > 0) {
      this.formRef.current.setFieldValue('pid', value[value.length - 1]);
    } else {
      this.formRef.current.setFieldValue('pid', '');
    }
  };

  render() {
    const {
      onSubmit,
      sysdistrict: { formTitle, formVisible, formDrawerOpen, formData, submitting },
      ...restProps
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
      <Drawer
        {...restProps}
        title={_.isEmpty(formData) ? formTitle : `${formTitle}--${formData.name}`}
        open={formDrawerOpen}
        destroyOnClose
        onClose={this.onClose}
        maskClosable={false}
        // afterOpenChange={(open) => {
        //   if (!open) {
        //     this.formRef.current.resetFields();
        //   }
        // }}
        footer={
          <Space className={styles.drawerFooter}>
            <Space style={{ textAlign: 'left' }}>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                关 闭
              </Button>
            </Space>
            <Space style={{ textAlign: 'right' }}>
              <PButton
                code="add"
                key="add"
                type="primary"
                icon={<SaveFilled />}
                onClick={() => this.formRef.current.submit()}
              >
                保存
              </PButton>
              <Button type="dashed" onClick={this.onClose}>
                取 消
              </Button>
            </Space>
          </Space>
        }
      >
        {formVisible && (
          <Form
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,
              is_active: formData.is_active === undefined ? true : formData.is_active,
              is_main: formData.is_main === undefined ? false : formData.is_main,
              is_real: formData.is_real === undefined ? true : formData.is_real,
              is_hot: formData.is_hot === undefined ? false : formData.is_hot,
              is_direct: formData.is_direct === undefined ? false : formData.is_direct,
              pids: formData.tree_path === undefined ? '' : formData.tree_path.split('/'),
              // pids: formData.tree_path === undefined ? "" : formData.tree_path.split('/'),
            }}
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
                <Form.Item label="上级" name="pids">
                  <DistrictCascader onChange={this.onDistrictParentChange} allowClear />
                </Form.Item>
                <Form.Item label="上级" name="pid" style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="简称" name="abbr" rules={[{ max: 16, message: '最多 16 字符' }]}>
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
                <Form.Item label="状态" name="is_active" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否主要" name="is_main" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="是否真实" name="is_real" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="是否热点" name="is_hot" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item label="是否直辖" name="is_direct" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default DistrictDrawerForm;

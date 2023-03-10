import React from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Button, Switch, message, Drawer, Input, Space, Row, Col } from 'antd';
import { SaveFilled } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';
import PButton from '@/components/PermButton';

import DistrictCascader from '@/components/DistrictCascader';
import DistrictTree from '@/components/DistrictTree';

import { SysDistrctItem } from '@/scheme/sysdistrict';

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

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  onFinish = (data) => {
    // console.log(' ======== === 0000 data : ', data);
    // console.log(' ======== === 0000 data : ', data.pids);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    let formData = data;
    const { onSubmit } = this.props;
    if (formData.pids) {
      delete formData.pids;
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
    if (value && value.length > 0) {
      this.formRef.current.setFieldValue('pid', value[0]);
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
                ??? ???
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
                ??????
              </PButton>
              <Button type="dashed" onClick={this.onClose}>
                ??? ???
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
                  label="??????"
                  name="name"
                  rules={[
                    { required: true, message: '???????????????' },
                    { max: 128, message: '?????? 128 ??????' },
                  ]}
                >
                  <Input placeholder="???????????????" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="??????[??????]"
                  name="name_en"
                  rules={[{ max: 128, message: '?????? 128 ??????' }]}
                >
                  <Input placeholder="???????????????[??????]" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="?????????"
                  name="sname"
                  rules={[{ max: 64, message: '?????? 64 ??????' }]}
                >
                  <Input placeholder="??????????????????" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="?????????[??????]"
                  name="sname_en"
                  rules={[{ max: 64, message: '?????? 64 ??????' }]}
                >
                  <Input placeholder="??????????????????[??????]" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label="??????" name="pids">
                  <DistrictTree onChange={this.onDistrictChange} allowClear />
                </Form.Item>
                <Form.Item label="??????" name="pid" style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="??????" name="abbr" rules={[{ max: 16, message: '?????? 16 ??????' }]}>
                  <Input placeholder="???????????????" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="????????????"
                  name="merge_name"
                  rules={[{ max: 256, message: '?????? 256 ??????' }]}
                >
                  <Input placeholder="?????????????????????" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="???????????????"
                  name="merge_sname"
                  rules={[{ max: 256, message: '?????? 256 ??????' }]}
                >
                  <Input placeholder="????????????????????????" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="????????????"
                  name="suffix"
                  rules={[{ max: 32, message: '?????? 32 ??????' }]}
                >
                  <Input placeholder="?????????????????????" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="??????"
                  name="pinyin"
                  rules={[{ max: 128, message: '?????? 128 ??????' }]}
                >
                  <Input placeholder="???????????????" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="??????"
                  name="initials"
                  rules={[{ max: 32, message: '?????? 32 ??????' }]}
                >
                  <Input placeholder="???????????????" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="??????"
                  name="area_code"
                  rules={[{ max: 8, message: '?????? 8 ??????' }]}
                >
                  <Input placeholder="???????????????" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="??????"
                  name="zip_code"
                  rules={[{ max: 8, message: '?????? 8 ??????' }]}
                >
                  <Input placeholder="???????????????" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item label="??????" name="is_active">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="????????????" name="is_main">
                  <Switch />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="????????????" name="is_real">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="????????????" name="is_hot">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form.Item label="????????????" name="is_direct">
                  <Switch />
                </Form.Item>
              </Col>
              {/* <Col span={6}></Col> */}
            </Row>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default DistrictDrawerForm;

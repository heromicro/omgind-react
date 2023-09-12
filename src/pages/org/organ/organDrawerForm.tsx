import React from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Button, Switch, message, Drawer, Input, Space, Row, Col, InputNumber } from 'antd';
import { SaveFilled } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import DistrictCascader from '@/components/cascader/DistrictCascader';
import { collectionDistrictIDs } from '@/scheme/sysaddress.sch';

import styles from './organDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  orgorgan: state.orgorgan,
}))
class OrganDrawerForm extends React.PureComponent {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    console.log(' ======== === 0000 values : ', values);

    this.formRef.current.scrollToField(errorFields[0].name);
  };

  onFinish = (data) => {
    console.log(' ======== === 0000 data : ', data);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    let formData = data;
    const { onSubmit } = this.props;
    if (formData.district_ids) {
      delete formData.district_ids;
    }

    console.log(' == ===== = === 1111 formData : ', formData);

    onSubmit(formData);

    return true;
  };

  onDistrictChange = (value, selectedOptions) => {
    console.log(' ------ = === -- == === value ', value);
    console.log(' --- --- === = -- ===== selectedOptions ', selectedOptions);

    if (selectedOptions) {
      switch (selectedOptions.length) {
        case 4:
          this.formRef.current.setFieldsValue({
            haddr: { county_id: selectedOptions[3].id, county: selectedOptions[3].name },
          });

        /* falls through */
        case 3:
          this.formRef.current.setFieldsValue({
            haddr: { city_id: selectedOptions[2].id, city: selectedOptions[2].name },
          });

        /* falls through */
        case 2:
          this.formRef.current.setFieldsValue({
            haddr: { province_id: selectedOptions[1].id, province: selectedOptions[1].name },
          });

        /* falls through */
        case 1:
          this.formRef.current.setFieldsValue({
            haddr: { country_id: selectedOptions[0].id, country: selectedOptions[0].name },
          });

          break;
        default:
          break;
      }
    }
  };

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'orgorgan/changeFormDrawerOpen',
      payload: false,
    });
  };

  render() {
    const {
      onSubmit,
      orgorgan: { formTitle, formVisible, formDrawerOpen, formData, submitting },
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

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(formData) ? formTitle : `${formTitle}--${formData.name}`}
        open={formDrawerOpen}
        destroyOnClose
        onClose={this.onClose}
        maskClosable={false}
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
            className="editform"
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,
              district_ids: formData.haddr ? collectionDistrictIDs(formData.haddr) : [],
              area_code: _.isEmpty(formData.area_code) ? '+86' : formData.area_code,
              is_active: _.isEmpty(formData.is_active) ? true : formData.is_active,
              sort: formData.sort ? formData.sort : 9999,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[
                    { max: 256, message: '最多 256 字符' },
                    { required: true, message: '名称必填' },
                  ]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="名称" allowClear />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="短名称"
                  name="sname"
                  rules={[
                    { max: 64, message: '最多 64 字符' },
                    { required: true, message: '短名称必填' },
                  ]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="短名称" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="助记码"
                  name="code"
                  rules={[{ max: 16, message: '最多 16 字符' }]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="短名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="执照号"
                  name="iden_no"
                  rules={[
                    { max: 20, message: '最多 20 字符' },
                    { required: true, message: '执照号必填' },
                  ]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="执照号" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="总部地址">
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="联系人"
                    name={['haddr', 'first_name']}
                    rules={[{ max: 64, message: '最多 64 字符' }]}
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input
                      addonBefore={
                        <Form.Item
                          name={['haddr', 'last_name']}
                          noStyle
                          rules={[{ max: 64, message: '最多 64 字符' }]}
                          normalize={(value, prevValue, prevValues) => value.trim()}
                        >
                          <Input style={{ width: 120 }} bordered={false} placeholder="姓" />
                        </Form.Item>
                      }
                      placeholder="名"
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="联系电话"
                    name={['haddr', 'mobile']}
                    rules={[{ max: 64, message: '最多 64 字符' }]}
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input
                      addonBefore={
                        <Form.Item
                          name={['haddr', 'area_code']}
                          noStyle
                          rules={[{ max: 8, message: '最多 8 字符' }]}
                          normalize={(value, prevValue, prevValues) => value.trim()}
                        >
                          <Input style={{ width: 80 }} bordered={false} />
                        </Form.Item>
                      }
                      placeholder="请输入联系电话"
                      allowClear
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="地址"
                    name="district_ids"
                    rules={[{ required: true, message: '总部地址必填' }]}
                  >
                    <DistrictCascader onChange={this.onDistrictChange} allowClear />
                  </Form.Item>

                  <Form.Item
                    label="国id"
                    name={['haddr', 'country_id']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>
                  <Form.Item
                    label="国"
                    name={['haddr', 'country']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>

                  <Form.Item
                    label="省/市id"
                    name={['haddr', 'province_id']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>
                  <Form.Item
                    label="省/市"
                    name={['haddr', 'province']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>

                  <Form.Item
                    label="市/区id"
                    name={['haddr', 'city_id']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>
                  <Form.Item
                    label="市/区"
                    name={['haddr', 'city']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>

                  <Form.Item
                    label="县/区id"
                    name={['haddr', 'county_id']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>
                  <Form.Item
                    label="县/区"
                    name={['haddr', 'county']}
                    hidden
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input type="hidden" allowClear />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="邮政编码"
                    name={['haddr', 'zip_code']}
                    rules={[{ max: 128, message: '最多 128 字符' }]}
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input placeholder="请输入邮政编码" allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="详细地址"
                    name={['haddr', 'daddr']}
                    rules={[{ max: 256, message: '最多 256 字符' }]}
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input.TextArea rows={2} placeholder="请输入邮政编码" allowClear />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Row>
              <Col span={12}>
                <Form.Item label="状态" name="is_active" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="排序值"
                  name="sort"
                  rules={[{ type: 'number', required: true, message: '请输入排序' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default OrganDrawerForm;

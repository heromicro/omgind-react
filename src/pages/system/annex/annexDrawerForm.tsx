import React from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import {
  Form,
  Button,
  Switch,
  Select,
  Drawer,
  Input,
  Space,
  Row,
  Col,
  InputNumber,
  Divider,
} from 'antd';

import { SaveFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';

import styles from './annexDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  sysannex: state.sysannex,
}))
class AssetDeviceDrawerForm extends React.PureComponent {
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

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'sysannex/changeFormDrawerOpen',
      payload: false,
    });
  };

  render() {
    const {
      onSubmit,
      sysannex: { formTitle, formVisible, formDrawerOpen, formData, submitting },
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

    console.log(' ------- ==== formData ', formData);

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
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,

              is_active: _.isEmpty(formData.is_active) ? true : formData.is_active,
              sort: formData.sort ? formData.sort : 9999,
              protocols: formData.protocols === undefined ? [] : formData.protocols,
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
                  label="IP"
                  name="ip"
                  rules={[
                    { max: 256, message: '最多 256 字符' },
                    { required: true, message: 'IP必填' },
                  ]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="IP" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
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

            <Row>
              <Col span={12}>
                <Form.Item label="有效否" name="is_active" valuePropName="checked">
                  <Switch checkedChildren="有效" unCheckedChildren="失效" defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item
                  label="备注"
                  name="memo"
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input.TextArea rows={2} placeholder="请输入备注" showCount maxLength={256} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default AssetDeviceDrawerForm;

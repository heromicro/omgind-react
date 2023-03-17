import React from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Button, Switch, message, Drawer, Input, Space, Row, Col } from 'antd';
import { SaveFilled } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import DistrictTree from '@/components/DistrictTree';

import styles from './addressDetail.less';

@connect((state) => ({
  sysaddress: state.sysaddress,
}))
class AddressDrawerForm extends React.PureComponent {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'sysaddress/changeFormDrawerOpen',
      payload: false,
    });
  };

  render() {
    const {
      onSubmit,
      sysaddress: { formTitle, formVisible, formDrawerOpen, formData, submitting },
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
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,
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
          </Form>
        )}
      </Drawer>
    );
  }
}

export default AddressDrawerForm;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, message, Card, Row, Col, InputNumber } from 'antd';

import RoleMenu from './RoleMenu';

@connect(state => ({
  role: state.role,
}))
class RoleCard extends PureComponent {
  formRef = React.createRef();

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  onOKClick = () => {
    const { onSubmit } = this.props;

    this.formRef
      .validateFields()
      .then(values => {
        const formData = { ...values };
        if (!formData.role_menus || formData.role_menus.length === 0) {
          message.warning('请选择菜单权限！');
          return;
        }

        const roleMenus = [];
        formData.role_menus.forEach(item => {
          if (item.actions && item.actions.length > 0) {
            item.actions.forEach(v => {
              roleMenus.push({ menu_id: item.menu_id, action_id: v });
            });
          } else {
            roleMenus.push({ menu_id: item.menu_id });
          }
        });
        formData.role_menus = roleMenus;

        onSubmit(formData);
      })
      .catch(err => {});
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      role: { formTitle, formVisible, formData, submitting },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    const formItemLayout2 = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    return (
      <Modal
        title={formTitle}
        width={800}
        open={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            name: formData.name,
            sort: formData.sort ? formData.sort : 10000,
            memo: formData.memo,
            role_menus: formData.role_menus,
          }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                label="角色名称"
                name="name"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                label="排序值"
                name="sort"
                rules={[{ type: 'number', required: true, message: '请输入排序' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item {...formItemLayout2} label="备注" name="memo">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
          <Card title="选择菜单权限" bordered={false}>
            <Form.Item name="role_menus">
              <RoleMenu />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    );
  }
}

export default RoleCard;

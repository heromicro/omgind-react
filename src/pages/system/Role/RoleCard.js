import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Card, Row, Col, InputNumber, Switch } from 'antd';

import RoleMenu from './RoleMenu';

@connect((state) => ({
  sysrole: state.sysrole,
}))
class RoleCard extends PureComponent {
  formRef = React.createRef();

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  onOKClick = () => {
    const { onSubmit } = this.props;

    this.formRef.current
      .validateFields()
      .then((values) => {
        const formData = { ...values };
        if (!formData.role_menus || formData.role_menus.length === 0) {
          message.warning('请选择菜单权限！');
          return;
        }

        const roleMenus = [];
        formData.role_menus.forEach((item) => {
          if (item.actions && item.actions.length > 0) {
            item.actions.forEach((v) => {
              roleMenus.push({ menu_id: item.menu_id, action_id: v });
            });
          } else {
            roleMenus.push({ menu_id: item.menu_id });
          }
        });
        formData.role_menus = roleMenus;

        onSubmit(formData);
      })
      .catch((err) => {});
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      sysrole: { formTitle, formVisible, formModalVisible, formData, submitting },
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
        open={formModalVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        {formVisible && (
          <Form
            ref={this.formRef}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,

              sort: formData.sort === undefined ? 100000 : formData.sort,
              is_active: formData.is_active === undefined ? true : formData.is_active,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="角色名称"
                  name="name"
                  rules={[{ required: true, message: '请输入角色名称' }]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
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
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="状态"
                  name="is_active"
                  valuePropName="checked"
                >
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              {...formItemLayout2}
              label="备注"
              name="memo"
              normalize={(value, prevValue, prevValues) => value.trim()}
            >
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
            <Card title="选择菜单权限" bordered={false}>
              <Form.Item name="role_menus">
                <RoleMenu />
              </Form.Item>
            </Card>
          </Form>
        )}
      </Modal>
    );
  }
}

export default RoleCard;

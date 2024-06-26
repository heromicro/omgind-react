import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Row, Col, Switch } from 'antd';
import { md5Hash } from '@/utils/utils';
import { pattern } from '@/utils/regex';
import RoleSelect from './RoleSelect';

@connect((state) => ({
  user: state.user,
}))
class UserCard extends PureComponent {
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

        formData.gender = parseInt(formData.gender, 10);
        if (formData.password && formData.password !== '') {
          formData.password = md5Hash(formData.password);
        }
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
      onCancel,
      user: { formType, formTitle, formVisible, formModalVisible, formData, submitting },
    } = this.props;

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
      <Modal
        title={formTitle}
        width={900}
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
              user_name: formData.user_name,
              password: formData.password,
              last_name: formData.last_name,
              first_name: formData.first_name,
              gender: formData.gender ? formData.gender.toString() : '1',
              is_active: formData.is_active === undefined ? true : formData.is_active,
              sort: formData.sort ? formData.sort : 10000,
              user_roles: formData.user_roles,
              email: formData.email,
              mobile: formData.mobile,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="用户名"
                  name="user_name"
                  rules={[{ required: true, message: '请输入用户名' }, pattern('name')]}
                >
                  <Input placeholder="请输入用户名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="登录密码"
                  name="password"
                  rules={[{ required: formType === 'A', message: '请输入登录密码' }]}
                >
                  <Input
                    type="password"
                    placeholder={formType === 'A' ? '请输入登录密码' : '留空则不修改登录密码'}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="姓"
                  name="last_name"
                  rules={[{ required: true, message: '请输入姓' }]}
                >
                  <Input placeholder="请输入姓" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="名"
                  name="first_name"
                  rules={[{ required: true, message: '请输入名' }]}
                >
                  <Input placeholder="请输入名" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="性别" name="gender">
                  <Radio.Group>
                    <Radio value="1">男</Radio>
                    <Radio value="2">女</Radio>
                    <Radio value="3">未知</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="用户状态" name="is_active">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              {...formItemLayout}
              label="所属角色"
              name="user_roles"
              rules={[{ required: true, message: '请选择所属角色' }]}
            >
              <RoleSelect />
            </Form.Item>

            <Form.Item {...formItemLayout} label="邮箱" name="email">
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="手机号" name="mobile">
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default UserCard;

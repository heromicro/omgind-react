import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Radio, Row, Col } from 'antd';
import { md5Hash } from '@/utils/utils';
import RoleSelect from './RoleSelect';

@connect(state => ({
  user: state.user,
}))
@Form.create()
class UserCard extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.status = parseInt(formData.status, 10);
        formData.gender = parseInt(formData.gender, 10);
        if (formData.password && formData.password !== '') {
          formData.password = md5Hash(formData.password);
        }
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      onCancel,
      user: { formType, formTitle, formVisible, formData, submitting },
      form: { getFieldDecorator },
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
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="用户名">
                {getFieldDecorator('user_name', {
                  initialValue: formData.user_name,
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ],
                })(<Input placeholder="请输入用户名" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="登录密码">
                {getFieldDecorator('password', {
                  initialValue: formData.password,
                  rules: [
                    {
                      required: formType === 'A',
                      message: '请输入登录密码',
                    },
                  ],
                })(
                  <Input
                    type="password"
                    placeholder={formType === 'A' ? '请输入登录密码' : '留空则不修改登录密码'}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="姓">
                {getFieldDecorator('last_name', {
                  initialValue: formData.last_name,
                  rules: [
                    {
                      required: true,
                      message: '请输入真实姓氏',
                    },
                  ],
                })(<Input placeholder="请输入姓氏" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="名">
                {getFieldDecorator('first_name', {
                  initialValue: formData.first_name,
                  rules: [
                    {
                      required: true,
                      message: '请输入真实名',
                    },
                  ],
                })(<Input placeholder="请输入名" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="性别">
                {getFieldDecorator('gender', {
                  initialValue: formData.status ? formData.status.toString() : '1',
                })(
                  <Radio.Group>
                    <Radio value="1">男</Radio>
                    <Radio value="2">女</Radio>
                    <Radio value="3">未知</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="用户状态">
                {getFieldDecorator('status', {
                  initialValue: formData.status ? formData.status.toString() : '1',
                })(
                  <Radio.Group>
                    <Radio value="1">正常</Radio>
                    <Radio value="2">停用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item {...formItemLayout} label="所属角色">
            {getFieldDecorator('user_roles', {
              initialValue: formData.user_roles,
              rules: [
                {
                  required: true,
                  message: '请选择所属角色',
                },
              ],
            })(<RoleSelect />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: formData.email,
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              initialValue: formData.phone,
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default UserCard;

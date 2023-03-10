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
                  label="?????????"
                  name="user_name"
                  rules={[{ required: true, message: '??????????????????' }, pattern('name')]}
                >
                  <Input placeholder="??????????????????" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="????????????"
                  name="password"
                  rules={[{ required: formType === 'A', message: '?????????????????????' }]}
                >
                  <Input
                    type="password"
                    placeholder={formType === 'A' ? '?????????????????????' : '??????????????????????????????'}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="???"
                  name="last_name"
                  rules={[{ required: true, message: '????????????' }]}
                >
                  <Input placeholder="????????????" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="???"
                  name="first_name"
                  rules={[{ required: true, message: '????????????' }]}
                >
                  <Input placeholder="????????????" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="??????" name="gender">
                  <Radio.Group>
                    <Radio value="1">???</Radio>
                    <Radio value="2">???</Radio>
                    <Radio value="3">??????</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="????????????" name="is_active">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              {...formItemLayout}
              label="????????????"
              name="user_roles"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <RoleSelect />
            </Form.Item>

            <Form.Item {...formItemLayout} label="??????" name="email">
              <Input placeholder="???????????????" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="?????????" name="mobile">
              <Input placeholder="??????????????????" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default UserCard;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { CodeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, Alert } from 'antd';
import { md5Hash } from '@/utils/utils';

import styles from './Index.less';

@connect(({ signin }) => ({
  signin,
}))
class SignIn extends PureComponent {
  formRef = React.createRef();

  vcodeInput = null;

  componentDidMount() {
    this.dispatch({
      type: 'signin/loadCaptcha',
    });
  }

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
  };

  reloadCaptcha = () => {
    console.log(' --- reload captcha ---');

    this.dispatch({
      type: 'signin/reloadCaptcha',
    });
  };

  handleSubmit = (v) => {
    const { dispatch, signin } = this.props;

    this.formRef.current
      .validateFields()
      .then((values) => {
        dispatch({
          type: 'signin/signIn',
          payload: {
            user_name: values.user_name,
            captcha_code: values.captcha_code,
            captcha_id: signin.captchaID,
            password: md5Hash(values.password),
          },
        });
      })
      .catch((err) => {});
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderMessage = (type, message) => (
    <Alert style={{ marginBottom: 24 }} message={message} type={type} closable />
  );

  render() {
    const { signin } = this.props;

    return (
      <div className={styles.main}>
        <Form ref={this.formRef} onFinish={this.handleSubmit} onFinishFailed={this.onFinishFailed}>
          {signin.status === 'FAIL' &&
            signin.submitting === false &&
            this.renderMessage('warning', signin.tip)}

          {signin.status === 'ERROR' &&
            signin.submitting === false &&
            this.renderMessage('error', signin.tip)}

          <Form.Item name="user_name" rules={[{ required: true, message: '请输入用户名！' }]}>
            <Input
              size="large"
              prefix={<UserOutlined className={styles.prefixIcon} />}
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input
              size="large"
              prefix={<LockOutlined className={styles.prefixIcon} />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item style={{ paddingRight: 0 }}>
            <Input.Group compact>
              <Form.Item
                noStyle
                name="captcha_code"
                rules={[{ required: true, message: '请输入图片验证码！' }]}
              >
                <Input
                  style={{ width: '60%', marginRight: 10 }}
                  size="large"
                  allowClear
                  autoComplete="off"
                  onClick={() => {
                    console.log(' +++++++ ----- ======= ');
                    // this.vcodeInput = "";
                  }}
                  ref={this.vcodeInput}
                  prefix={<CodeOutlined className={styles.prefixIcon} />}
                  placeholder="请输入图片验证码"
                />
              </Form.Item>

              <div style={{ width: 120, height: 40, paddingRight: 0, paddingLeft: 0 }}>
                <img
                  style={{ maxWidth: '100%', maxHeight: '100%', paddingRight: 0, paddingLeft: 0 }}
                  src={signin.captcha}
                  alt="验证码"
                  onClick={() => {
                    this.reloadCaptcha();
                  }}
                />
              </div>
            </Input.Group>
          </Form.Item>
          <Form.Item className={styles.additional}>
            <Button
              size="large"
              loading={signin.submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              登　　录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default SignIn;

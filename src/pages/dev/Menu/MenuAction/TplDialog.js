import React, { PureComponent } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Modal, Input, Row, Col, Tooltip } from 'antd';

class TplDialog extends PureComponent {
  formRef = React.createRef();

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleOKClick = () => {
    const { onSubmit } = this.props;
    this.formRef.current
      .validateFields()
      .then((values) => {
        onSubmit({ ...values });
      })
      .catch((err) => {});
  };

  render() {
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
        title="快速创建模板"
        width={450}
        open
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form
          ref={this.formRef}
          initialValues={{
            path: '/api/v2/',
          }}
        >
          <Form.Item
            label="接口路径"
            {...formItemLayout}
            name="path"
            rules={[{ required: true, message: '请输入接口路径' }]}
          >
            <Row>
              <Col span={20}>
                <Input placeholder="请输入" />
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title="例：/api/v2/demos">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default TplDialog;

import React, { PureComponent } from 'react';
import { Form, Modal, Input, Card } from 'antd';
import MenuActionResource from '../MenuActionResource';

class FormDialog extends PureComponent {
  formRef = React.createRef();

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  handleOKClick = () => {
    const { onSubmit } = this.props;
    this.formRef.current
      .validateFields()
      .then((values) => {
        onSubmit({ ...values });
      })
      .catch((err) => {});
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const { formData } = this.props;

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

    console.log(' --- ====== ======== ---- == formData.resources: ', formData.resources);

    return (
      <Modal
        title="菜单动作(按钮)管理"
        width={650}
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
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            code: formData.code,
            name: formData.name,
            resources: formData.resources,
          }}
        >
          <Form.Item
            {...formItemLayout}
            label="动作编号"
            name="code"
            rules={[{ required: true, message: '编号必填' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="动作名称"
            name="name"
            rules={[{ required: true, message: '名称必填' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item>
            <Card title="资源管理(服务端接口映射)" bordered={false} name="resources">
              <MenuActionResource />
            </Card>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FormDialog;

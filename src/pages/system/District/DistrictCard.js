import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch } from 'antd';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrctCard extends PureComponent {
  formRef = React.createRef();

  onOKClick = () => {
    const { onSubmit } = this.props;

    this.formRef.current
      .validateFields()
      .then((values) => {
        console.log(' ----- === values :', values);
        const formData = { ...values };
        onSubmit(formData);
      })
      .catch((err) => {
        console.log(' ----- === err :', err.values);
        console.log(' ----- === err :', err.errorFields);
        console.log(' ----- === err :', err.outOfDate);
      });
  };

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      onCancel,
      sysdistrict: { formTitle, formVisible, formModalVisible, formData, submitting },
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
        width={600}
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
              code: formData.code,
              name: formData.name,
              memo: formData.memo,
              is_active: formData.statuis_actives === undefined ? true : formData.is_active,
            }}
          >
            <Form.Item
              {...formItemLayout}
              label="编号"
              name="code"
              rules={[{ required: true, message: '请输入编号' }]}
            >
              <Input placeholder="请输入编号" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注" name="memo">
              <Input.TextArea rows={2} placeholder="请输入备注" showCount maxLength={256} />
            </Form.Item>
            <Form.Item {...formItemLayout} label="状态" name="is_active">
              <Switch defaultChecked />
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default DistrctCard;

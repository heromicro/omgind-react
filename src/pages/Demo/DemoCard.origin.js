import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch } from 'antd';

import DistrictCascader from '@/components/DistrictCascader';


@connect((state) => ({
  demo: state.demo,
}))
class DemoCard extends PureComponent {
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
      demo: { formTitle, formVisible, formModalVisible, formData, submitting },
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
              label="??????"
              name="code"
              rules={[{ required: true, message: '???????????????' }]}
            >
              <Input placeholder="???????????????" />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="??????"
              name="name"
              rules={[{ required: true, message: '???????????????' }]}
            >
              <Input placeholder="???????????????" />
            </Form.Item>
            
            
            <Form.Item {...formItemLayout} label="??????" name="memo">
              <Input.TextArea rows={2} placeholder="???????????????" showCount maxLength={256} />
            </Form.Item>
            <Form.Item {...formItemLayout} label="??????" name="is_active">
              <Switch defaultChecked />
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

export default DemoCard;

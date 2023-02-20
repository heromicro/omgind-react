import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch } from 'antd';

import FormRender, { connectForm } from 'form-render';

import { DemoFormSchema } from './formMetaData';

@connect((state) => ({
  loading: state.loading.models.setting,
  demo: state.demo,
}))
class DemoCard extends PureComponent {
  onOKClick = () => {
    const { onSubmit, form } = this.props;

    form
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

  onMount() {
    console.log(' ======== === onMount:');
  }

  beforeFinish(params) {
    // this.formRef.current.scrollToField(errorFields[0].name);
    console.log(' ======== === params:', params);
  }

  onFinish(formData) {
    console.log(' ======== === formData:', formData);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      onCancel,
      demo: { formTitle, formVisible, formModalVisible, formData, submitting },
      form,
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
          <>
            <FormRender
              form={form}
              schema={DemoFormSchema}
              beforeFinish={this.beforeFinish}
              onFinish={this.onFinish}
              onMount={this.onMount}
            />
          </>
        )}
      </Modal>
    );
  }
}

export default connectForm(DemoCard);

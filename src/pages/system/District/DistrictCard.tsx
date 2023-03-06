import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch } from 'antd';
import FormRender, { connectForm } from 'form-render';

import { DistrictFormSchema } from './formMeta';

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
          <FormRender
            debug
            initialValues={formData}
            form={form}
            schema={DistrictFormSchema}
            // beforeFinish={this.beforeFinish}
            onFinish={this.onFinish}
            // onMount={this.onMount}
          />
        )}
      </Modal>
    );
  }
}

export default connectForm(DistrctCard);

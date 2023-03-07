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
  /* eslint-disable */
  constructor(props) {
    super(props);
  }

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

  beforeFinish(params) {
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

    const onMount = () => {
      
    };

    const watch = {
      '#': (val) => {},
    };

    // console.log(" ---------- ===== ------- formData: ", formData)

    return (
      <Modal
        title={formTitle}
        width={800}
        open={formModalVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {formVisible && (
          <>
            <FormRender
              debug
              initialValues={formData}
              form={form}
              schema={DemoFormSchema}
              beforeFinish={this.beforeFinish}
              onFinish={this.onFinish}
              // onMount={this.onMount}
              onMount={onMount}
              // watch={this.watch}
            />
          </>
        )}
      </Modal>
    );
  }
}

export default connectForm(DemoCard);

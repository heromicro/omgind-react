import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Card, Switch, Radio, Row, Col, InputNumber } from 'antd';

import DictItem from './DictItem';

@connect((state) => ({
  dict: state.dict,
}))
class DictCard extends PureComponent {
  formRef = React.createRef();

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  onOKClick = () => {
    const { onSubmit } = this.props;

    console.log(' _ qqqqqqqqqqqq ++++ ');
    this.formRef.current
      .validateFields()
      .then((values) => {
        const formData = { ...values };
        console.log(' _ qqqqqqqqqqqq ++++ ', formData);
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
      dict: { formTitle, formVisible, formModalVisible, formData, submitting },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    const formItemLayout2 = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    // console.log(" -------- 00000 === ", formData);
    // console.log(" -------- 00000 === ", formData.items);

    return (
      <Modal
        title={formTitle}
        width={1000}
        open={formModalVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        {' '}
        {formVisible && (
          <Form
            ref={this.formRef}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              name_cn: formData.name_cn,
              name_en: formData.name_en,
              is_active: formData.is_active === undefined ? true : formData.is_active,
              sort: formData.sort ? formData.sort : 9999,
              memo: formData.memo,
              items: formData.items,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="??????(???)"
                  name="name_cn"
                  rules={[{ required: true, message: '???????????????(???)' }]}
                >
                  <Input placeholder="???????????????(???)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="??????(???)"
                  name="name_en"
                  rules={[{ required: true, message: '???????????????(???)' }]}
                >
                  <Input placeholder="???????????????(???)" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="??????" name="is_active">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="?????????"
                  name="sort"
                  rules={[{ type: 'number', required: true, message: '???????????????' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item {...formItemLayout2} label="??????" name="memo">
              <Input.TextArea rows={2} placeholder="???????????????" />
            </Form.Item>
            <Card title="???????????????" bordered={false}>
              <Form.Item name="items">
                <DictItem />
              </Form.Item>
            </Card>
          </Form>
        )}
      </Modal>
    );
  }
}

export default DictCard;

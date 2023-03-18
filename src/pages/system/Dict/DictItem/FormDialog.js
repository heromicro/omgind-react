import React, { PureComponent } from 'react';
import { Form, Modal, Input, Card, Col, Row, Radio, InputNumber, message, Switch } from 'antd';

class FormDialog extends PureComponent {
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

    console.log(' --- === sss ');

    this.formRef.current
      .validateFields()
      .then((values) => {
        console.log(' --- === --- values ', values);
        let val = { ...values };
        val.value = parseInt(values.value, 10);
        onSubmit({ ...val });
      })
      .catch((err) => {});
  };

  render() {
    const { visible, formData } = this.props;
    let s = JSON.stringify(formData);
    // console.log(` +++++ ===== 5555 === ${s} `);

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

    return (
      <Modal
        title="字典数据项"
        width={900}
        open={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        bodyStyle={{ maxHeight: 'calc(100vh - 158px)', overflowY: 'auto' }}
      >
        <Form
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            id: formData.id,
            dict_id: formData.dict_id,
            label: formData.label,
            value: formData.value,
            is_active: formData.is_active === undefined ? true : formData.is_active,
            sort: formData.sort ? formData.sort : 9999,
            memo: formData.memo,
          }}
        >
          <Form.Item name="id">
            <Input type="hidden" disabled />
          </Form.Item>
          <Form.Item name="dict_id">
            <Input type="hidden" disabled />
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                label="显示值"
                name="label"
                rules={[{ required: true, message: '请输入显示值' }]}
              >
                <Input placeholder="请输入显示值" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                label="字典值"
                name="value"
                rules={[{ required: true, message: '请输入字典值' }]}
              >
                <Input placeholder="请输入字典值" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="状态" name="is_active">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                label="排序值"
                name="sort"
                rules={[{ type: 'number', required: true, message: '请输入排序' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item {...formItemLayout2} label="备注" name="memo">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FormDialog;

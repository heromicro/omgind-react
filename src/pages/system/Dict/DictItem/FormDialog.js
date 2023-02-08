import React, { PureComponent } from 'react';
import { Modal, Input, Card, Col, Row, Radio, InputNumber, message } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

@Form.create()
class FormDialog extends PureComponent {
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, value) => {
      let val = { ...value };
      if (!err) {
        val.status = parseInt(value.status, 10);
        val.sort = parseInt(value.sort, 10);
        val.value = parseInt(value.value, 10);

        onSubmit({ ...val });
      }
    });
  };

  render() {
    const { visible, formData, form } = this.props;
    const { getFieldDecorator } = form;
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
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        bodyStyle={{ maxHeight: 'calc(100vh - 158px)', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item name="id">
            {getFieldDecorator('id', {
              initialValue: formData.id,
            })(<Input type="hidden" disabled />)}
          </Form.Item>
          <Form.Item name="dict_id">
            {getFieldDecorator('dict_id', {
              initialValue: formData.dict_id,
            })(<Input type="hidden" disabled />)}
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="显示值">
                {getFieldDecorator('label', {
                  initialValue: formData.label,
                  rules: [
                    {
                      required: true,
                      message: '请输入显示值',
                    },
                  ],
                })(<Input placeholder="请输入显示值" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="字典值">
                {getFieldDecorator('value', {
                  initialValue: formData.value,
                  rules: [
                    {
                      required: true,
                      message: '请输入字典值',
                    },
                  ],
                })(<Input placeholder="请输入字典值" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status', {
                  initialValue: formData.status ? formData.status.toString() : '1',
                })(
                  <Radio.Group>
                    <Radio value="1">启用</Radio>
                    <Radio value="2">禁用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="排序值">
                {getFieldDecorator('sort', {
                  initialValue: formData.sort ? formData.sort.toString() : '9999',
                  rules: [
                    {
                      required: true,
                      message: '请输入排序值',
                    },
                  ],
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item {...formItemLayout2} label="备注">
            {getFieldDecorator('memo', {
              initialValue: formData.memo,
            })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FormDialog;

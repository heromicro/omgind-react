import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, message, Card, Switch, Radio, Row, Col, InputNumber } from 'antd';

import DictItem from './DictItem';

@connect(state => ({
  dict: state.dict,
}))
@Form.create()
class DictCard extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    console.log(' _ qqqqqqqqqqqq ++++ ');

    form.validateFieldsAndScroll((err, values) => {
      console.log(' +++++ ====== ggggg ', err);

      if (!err) {
        const formData = { ...values };
        console.log(` ---- ==== ssdd = ++++ ${formData} `);
        formData.status = parseInt(formData.status, 10);
        formData.sort = parseInt(formData.sort, 10);
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      dict: { formTitle, formVisible, formData, submitting },
      form: { getFieldDecorator },
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
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="名称(中)">
                {getFieldDecorator('name_cn', {
                  initialValue: formData.name_cn,
                  rules: [
                    {
                      required: true,
                      message: '请输入名称(中)',
                    },
                  ],
                })(<Input placeholder="请输入名称(中)" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="名称(英)">
                {getFieldDecorator('name_en', {
                  initialValue: formData.name_en,
                  rules: [
                    {
                      required: true,
                      message: '请输入名称(英)',
                    },
                  ],
                })(<Input placeholder="请输入名称(英)" />)}
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
              {/* <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status', {
                  initialValue: formData.status,
                })(<Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />)}
              </Form.Item> */}
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

          <Form.Item>
            <Card title="选择数据项" bordered={false}>
              {getFieldDecorator('items', {
                initialValue: formData.items,
              })(<DictItem />)}
            </Card>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default DictCard;

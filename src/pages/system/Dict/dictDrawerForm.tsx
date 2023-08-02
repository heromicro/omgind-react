import React from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import {
  Form,
  Button,
  Switch,
  Select,
  Drawer,
  Input,
  Space,
  Row,
  Col,
  InputNumber,
  Divider,
} from 'antd';

import type { UploadProps } from 'antd';

import { SaveFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';

import styles from './dictDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  sysdict: state.sysdict,
}))
class DictDrawerForm extends React.PureComponent {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);

    this.state = {
      valTipe: 'int',
    };
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    console.log(' ======== === 0000 values : ', values);

    this.formRef.current.scrollToField(errorFields[0].name);
  };

  onFinish = (data) => {
    console.log(' ======== === 0000 data : ', data);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    let formData = data;
    const { onSubmit } = this.props;
    if (formData.district_ids) {
      delete formData.district_ids;
    }

    console.log(' == ===== = === 1111 formData : ', formData);

    onSubmit(formData);

    return true;
  };

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'sysdict/changeFormDrawerOpen',
      payload: false,
    });
  };

  render() {
    const {
      onSubmit,
      sysdict: { formTitle, formType, formVisible, formDrawerOpen, formData, submitting },
      ...restProps
    } = this.props;

    const { valTipe } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 23 },
      },
    };

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(formData) ? formTitle : `${formTitle}--${formData.name}`}
        open={formDrawerOpen}
        destroyOnClose
        onClose={this.onClose}
        maskClosable={false}
        footer={
          <Space className={styles.drawerFooter}>
            <Space style={{ textAlign: 'left' }}>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                关 闭
              </Button>
            </Space>
            <Space style={{ textAlign: 'right' }}>
              <PButton
                code="add"
                key="add"
                type="primary"
                icon={<SaveFilled />}
                onClick={() => this.formRef.current.submit()}
              >
                保存
              </PButton>
              <Button type="dashed" onClick={this.onClose}>
                取 消
              </Button>
            </Space>
          </Space>
        }
      >
        {formVisible && (
          <Form
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,

              is_active: formData.is_active === undefined ? true : formData.is_active,
              sort: formData.sort === undefined ? 999 : formData.sort,
              val_tipe: formData.val_tipe === undefined ? 'int' : formData.val_tipe,
              items: formData.items,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="名称"
                  name="name_cn"
                  rules={[
                    { max: 128, message: '最多 128 字符' },
                    { required: true, message: '名称(中)必填' },
                  ]}
                >
                  <Input placeholder="请输入名称(中)" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="名称(英)"
                  name="name_en"
                  rules={[
                    { max: 128, message: '最多 128 字符' },
                    { required: true, message: '名称(英)必填' },
                  ]}
                >
                  <Input placeholder="请输入名称(英)" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="索引[不可改]"
                  name="dict_key"
                  rules={[{ required: true, message: '请输入索引' }]}
                >
                  {formType === 'E' ? (
                    <Input placeholder="请输入索引" readOnly disabled />
                  ) : (
                    <Input placeholder="请输入索引" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="值类型"
                  name="val_tipe"
                  rules={[{ required: true, message: '请选择值类型' }]}
                >
                  <Select
                    allowClear
                    placeholder="请选择值类型"
                    onChange={(value) => {
                      this.setState({
                        valTipe: value,
                      });
                    }}
                    disabled={formData.val_tipe !== undefined}
                  >
                    <Select.Option value="int">整数</Select.Option>
                    <Select.Option value="str">字符串</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="排序值"
                  name="sort"
                  rules={[{ type: 'number', required: true, message: '请输入排序' }]}
                >
                  <InputNumber min={1} step={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="有效否" name="is_active" valuePropName="checked">
                  <Switch checkedChildren="有效" unCheckedChildren="失效" defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item label="备注" name="memo">
                  <Input.TextArea rows={2} placeholder="请输入备注" showCount maxLength={256} />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">数据项</Divider>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key}>
                      <Form.Item {...field} noStyle name={[field.name, 'id']}>
                        <Input hidden />
                      </Form.Item>
                      <Form.Item {...field} noStyle name={[field.name, 'dict_id']}>
                        <Input hidden />
                      </Form.Item>

                      <Col span={5}>
                        <Form.Item
                          {...field}
                          label="显示值"
                          name={[field.name, 'label']}
                          rules={[{ required: true, message: '显示值必填' }]}
                        >
                          <Input allowClear style={{ width: '100%' }} placeholder="请输入显示值" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...field}
                          label="字典值"
                          name={[field.name, 'value']}
                          rules={[{ required: true, message: '字典值必填' }]}
                        >
                          {valTipe === 'int' ? (
                            <InputNumber
                              allowClear
                              step={1}
                              style={{ width: '100%' }}
                              parser={(value) => value.replace(/[^\d]/g, '')}
                              placeholder="请输入字典值"
                            />
                          ) : (
                            <Input
                              allowClear
                              style={{ width: '100%' }}
                              maxLength={32}
                              placeholder="请输入字典值"
                            />
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <Form.Item
                          {...field}
                          label="有效"
                          name={[field.name, 'is_active']}
                          valuePropName="checked"
                        >
                          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item {...field} label="排序" name={[field.name, 'sort']}>
                          <InputNumber
                            allowClear
                            step={1}
                            min={1}
                            defaultValue={99}
                            parser={(value) => value.replace(/[^\d]/g, '')}
                            style={{ width: '100%' }}
                            placeholder="请输入端口号"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={5}>
                        <Form.Item {...field} label="备注" name={[field.name, 'memo']}>
                          <Input allowClear style={{ width: '100%' }} placeholder="请输入备注" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <Form.Item>
                          <br />
                          <Button type="dashed" danger block onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          添 加
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default DictDrawerForm;

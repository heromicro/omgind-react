import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Card,
  Radio,
  Modal,
  TreeSelect,
  Tooltip,
  InputNumber,
  Row,
  Col,
  Switch,
} from 'antd';
import { adaptTreeSelect } from '@/utils/uiutil';

import MenuAction from './MenuAction';

@connect(({ sysmenu }) => ({
  sysmenu,
}))
class MenuCard extends PureComponent {
  formRef = React.createRef();

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
  };

  onOKClick = () => {
    const { onSubmit } = this.props;
    this.formRef.current
      .validateFields()
      .then((values) => {
        const formData = { ...values };
        formData.sort = parseInt(formData.sort, 10);
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
      sysmenu: { formVisible, formTitle, formModalVisible, formData, submitting, treeData },
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

    const formItemLayoutSub = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24,
      },
    };

    console.log(' ----- === ==== treeData: ', treeData);
    // console.log(' ----- === ==== formData: ', formData);
    // console.log(' ----- === ==== formVisible: ', formVisible);

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
        <Card size="small" bordered={false}>
          {formVisible && (
            <Form
              ref={this.formRef}
              onFinishFailed={this.onFinishFailed}
              initialValues={{
                name: formData.name,
                parent_id: formData.parent_id,
                router: formData.router,
                icon: formData.icon,
                is_show: formData.is_show !== undefined ? formData.is_show : true,
                is_active: formData.is_active === undefined ? true : formData.is_active,
                sort: formData.sort ? formData.sort : 10000,
                memo: formData.memo,
                open_blank: formData.open_blank !== undefined ? formData.open_blank : false,
                actions: formData.actions,
              }}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="菜单名称"
                    name="name"
                    rules={[{ required: true, message: '请输入菜单名称' }]}
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="上级菜单" name="parent_id">
                    <TreeSelect
                      showSearch
                      allowClear
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={adaptTreeSelect(treeData, 'name')}
                      placeholder="请选择上级菜单"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="访问路径"
                    name="router"
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input placeholder="请输入前端路径" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="菜单图标">
                    <Row>
                      <Col span={20}>
                        <Form.Item
                          {...formItemLayoutSub}
                          name="icon"
                          normalize={(value, prevValue, prevValues) => value.trim()}
                        >
                          <Input placeholder="请输入菜单图标" />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ textAlign: 'center' }}>
                        <Tooltip title="图标仅支持官方Icon图标(V3版本)">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="是否显示"
                    name="is_show"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="有效"
                    name="is_active"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="排序值"
                    name="sort"
                    rules={[{ required: true, message: '请输入排序值' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="备注"
                    name="memo"
                    normalize={(value, prevValue, prevValues) => value.trim()}
                  >
                    <Input placeholder="请输入备注" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...formItemLayout}
                    label="打开新窗口"
                    name="open_blank"
                    valuePropName="checked"
                  >
                    <Switch defaultUnchecked />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card title="动作(按钮)管理" bordered={false}>
                    <Form.Item name="actions">
                      <MenuAction />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Card>
      </Modal>
    );
  }
}

export default MenuCard;

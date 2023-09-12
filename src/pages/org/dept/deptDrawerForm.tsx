import React from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Button, Switch, message, Drawer, Input, Space, Row, Col, InputNumber } from 'antd';
import { SaveFilled } from '@ant-design/icons';

import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import OrganSelector from '@/components/selectors/OrganSelector';
import DeptCascader from '@/components/cascader/DeptCascader';

import styles from './deptDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  orgdept: state.orgdept,
}))
class DeptDrawerForm extends React.Component {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);
    this.state = {
      sorgId: '',
    };
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
  };

  onFinish = (data) => {
    // console.log(' ======== === 0000 data : ', data);
    // console.log(' ======== === 0000 data : ', data.pids);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    let formData = data;
    const { onSubmit } = this.props;
    if (formData.district_ids) {
      delete formData.district_ids;
    }
    if (formData.pids) {
      delete formData.pids;
    }

    console.log(' ==== ==== === 1111 formData : ', formData);

    onSubmit(formData);

    return true;
  };

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'orgdept/changeFormDrawerOpen',
      payload: false,
    });
  };

  onOrganSelectorChange = (value, option) => {
    console.log(' ------ = = onOrganSelectorChange == -- == === value ', value);
    console.log(' ------ = = onOrganSelectorChange == -- == === option ', option);

    this.setState({
      sorgId: value,
    });
  };

  onDeptParentChange = (value, selectedOptions) => {
    if (value && value.length > 0) {
      this.formRef.current.setFieldValue('pid', value[value.length - 1]);
    } else {
      this.formRef.current.setFieldValue('pid', '');
    }
  };

  render() {
    const {
      onSubmit,
      orgdept: { formTitle, formVisible, formDrawerOpen, formData, submitting, formType },
      ...restProps
    } = this.props;

    const { sorgId } = this.state;

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

    // console.log(' ---- === ----- = formData === ', formData);
    // console.log(' ---- === ----- = formData.org_id === ', formData.org_id);
    // console.log(' ---- === ----- = sorgId === ', sorgId);
    // console.log(' ---- === ----- = formType === ', formType);

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
        {/* {((formData.org_id && formType == 'E') || (formType == 'A' && formVisible)) && ( */}
        {formVisible && (
          <Form
            className="editform"
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,
              is_active: _.isEmpty(formData.is_active) ? true : formData.is_active,
              sort: formData.sort ? formData.sort : 9999,
              pids: formData.tree_path ? formData.tree_path.split('/') : null,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[
                    { max: 64, message: '最多 64 字符' },
                    { required: true, message: '名称必填' },
                  ]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="请输入请输入名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="助记码"
                  name="code"
                  rules={[{ max: 16, message: '最多 16 字符' }]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input placeholder="请输入助记码" allowClear style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="所属企业"
                  name="org_id"
                  rules={[{ required: true, message: '名称必填' }]}
                >
                  <OrganSelector
                    mode="combobox"
                    onChange={this.onOrganSelectorChange}
                    disabled={formType === 'E'}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="上级" name="pids">
                  <DeptCascader
                    onChange={this.onDeptParentChange}
                    orgId={formType === 'E' ? (formData.org_id ? formData.org_id : null) : sorgId}
                    disabled={
                      (formType === 'E' && !formData.org_id) || (formType === 'A' && !sorgId)
                    }
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="上级"
                  name="pid"
                  hidden
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="备注"
                  name="memo"
                  rules={[{ max: 1024, message: '最多 1024 字符' }]}
                  normalize={(value, prevValue, prevValues) => value.trim()}
                >
                  <Input.TextArea rows={3} placeholder="请输入备注" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="状态" name="is_active" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="排序值"
                  name="sort"
                  rules={[{ type: 'number', required: true, message: '请输入排序' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default DeptDrawerForm;

import React, { PureComponent } from 'react';
import { Form, Modal, Input, Card } from 'antd';
import {
  EditableProTable,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { methods } from '@/utils/request';
import { fillFormKey, newUUID } from '@/utils/utils';

class FormDialog extends PureComponent {
  formRef = React.createRef();
  actionRef = React.createRef();
  editorFormRef = React.createRef();
  editableFormRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      formData: props.formData,
      editableKeys: [],
    };
  }

  onFinishFailed({ values, errorFields, outOfDate }) {
    this.formRef.current.scrollToField(errorFields[0].name);
  }

  handleOKClick = () => {
    const { onSubmit } = this.props;
    this.formRef.current
      .validateFields()
      .then(values => {
        onSubmit({ ...values });
      })
      .catch(err => {});
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  handleDeleteOneResourceItem = record => {
    const tableDataSource = this.formRef.current?.getFieldValue('resources');
    console.log(' ------ ====== --- tableDataSource --- ', tableDataSource);
    console.log(' ------ ====== --- record --- ', record);
    const { formData } = this.state;

    let newdata = tableDataSource.filter(item => {
      if (record.key !== undefined) {
        if (item.key !== record.key) {
          return true;
        }
      } else if (record.id !== undefined) {
        if (item.id !== record.id) {
          return true;
        }
      }

      return false;
    });

    const tableDataSource1 = this.formRef.current?.getFieldValue('resources');
    this.setState({
      formData: { ...formData, resources: newdata },
    });

    console.log(' ------ ====== --- newdata --- ', newdata);
    console.log(' ------ ====== --- tableDataSource1 --- ', tableDataSource1);
    console.log(' ------ ====== --- formData.resources --- ', formData.resources);

    // this.formRef.current.setFieldValue({
    //   resources: newdata
    // })
  };

  render() {
    const { formData, editableKeys } = this.state;

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

    const columns = [
      {
        title: '请求方式',
        dataIndex: 'method',
        editable: true,
        width: '30%',
        formItemProps: () => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
        valueType: 'select',
        valueEnum: {
          GET: {
            text: methods.GET,
          },
          POST: {
            text: methods.POST,
          },
          PUT: {
            text: methods.PUT,
          },
          DELETE: {
            text: methods.DELETE,
          },
          PATCH: {
            text: methods.PATCH,
          },
          HEAD: {
            text: methods.HEAD,
          },
          OPTIONS: {
            text: methods.OPTIONS,
          },
        },
      },
      {
        title: '请求路径',
        dataIndex: 'path',
        editable: true,
        width: '45%',
        formItemProps: () => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
      },
      {
        title: '操作',
        valueType: 'option',
        width: '25%',
        render: (text, record, row, action) => {
          return (
            <>
              <a
                href="#"
                key="editable"
                onClick={() => {
                  console.log(' -----===== ==== ');
                  if (record.id) {
                    // action.startEditable(record.id);
                    this.actionRef.current.startEditable(record.id);
                  } else {
                    // action.startEditable(record.key);
                    this.actionRef.current.startEditable(record.key);
                  }
                }}
              >
                编辑
              </a>
              &nbsp;
              {/* <Popconfirm title="确定要删除该数据吗?" onConfirm={() => this.handleDeleteOneResourceItem(record)}> */}
              <a
                href="#"
                key="delete"
                onClick={() => {
                  this.handleDeleteOneResourceItem(record);
                }}
              >
                删除
              </a>
              {/* </Popconfirm> */}
            </>
          );
        },
        editable: false,
      },
    ];

    console.log(' --- ====== ======== ---- == formData.resources: ', formData.resources);

    return (
      <Modal
        title="菜单动作(按钮)管理"
        width={650}
        open
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOKClick}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            code: formData.code,
            name: formData.name,
            resources: formData.resources,
          }}
        >
          <Form.Item
            {...formItemLayout}
            label="动作编号"
            name="code"
            rules={[{ required: true, message: '编号必填' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="动作名称"
            name="name"
            rules={[{ required: true, message: '名称必填' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item>
            <Card title="资源管理(服务端接口映射)" bordered={false} name="resources">
              <EditableProTable
                rowKey={record => {
                  if (record.key) {
                    return record.key;
                  }
                  return record.id;
                }}
                name="resources"
                bordered
                columns={columns}
                value={formData.resources}
                dataSource={formData.resources}
                actionRef={this.actionRef}
                formRef={this.editorFormRef}
                editableFormRef={this.editableFormRef}
                editable={{
                  form: this.formRef,
                  type: 'multiple',
                  // type: 'single',
                  editableKeys,
                  actionRender: (row, config, defaultDom) => {
                    return [defaultDom.save, defaultDom.delete || defaultDom.cancel];
                  },
                  // eslint-disable-next-line
                  onChange: editableKeys => {
                    this.setState({
                      editableKeys,
                    });
                  },
                  onDelete: (key, row) => {
                    console.log(' ------- ==== ==== key: ', key);
                    console.log(' ------- ==== ==== row: ', row);
                  },
                }}
                maxLength={10}
                recordCreatorProps={{
                  // position: 'top',
                  record: () => {
                    let oneitem = {
                      key: newUUID(),
                      editable: true,
                    };

                    console.log(' --- ======= --------- ==oneitem= ', oneitem);
                    // let newdata = [] //[...formData.resources, oneitem];
                    // this.setState({
                    //   formData: {...formData, resource: newdata}
                    // })

                    return oneitem;
                  },
                  creatorButtonText: ' 新 增',
                }}
              />
            </Card>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FormDialog;

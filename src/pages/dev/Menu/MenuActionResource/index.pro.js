import React, { PureComponent } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormField,
  ProFormRadio,
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import { fillFormKey, newUUID } from '@/utils/utils';

import { methods } from '@/utils/request';

import styles from './index.less';

export default class MenuActionResource extends React.PureComponent {
  // formRef = React.createRef();
  actionRef = React.createRef();
  editorFormRef = React.createRef();
  editableFormRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      dataSource: fillFormKey(props.value),
      addVisible: false,
      editableKeys: [],
    };

    // console.log(" ---- ===== this.state.dataSource ", this.state.dataSource.length)
  }

  // componentDidMount() {
  // }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, dataSource: fillFormKey(nextProps.value) };
    }
    return state;
  }

  handleAddCancel = () => {
    this.setState({ addVisible: false });
  };

  handleDeleteOneItem = (record) => {
    console.log(' ---- ======= === delete record ', record);
    const { dataSource } = this.state;
    console.log(' ---- ======= ===  dataSource ', dataSource.length);

    const data = dataSource.filter((item) => {
      if (record.id) {
        if (record.id === item.id) {
          return true;
        }
        return false;
      }
      if (record.no) {
        if (record.no === item.no) {
          return true;
        }
        return false;
      }
      return false;
    });

    // this.setState({ dataSource: data }, () => {
    //   this.triggerChange(data);
    // });
  };

  handleSave = (row) => {
    const { dataSource } = this.state;
    const data = [...dataSource];
    const index = data.findIndex((item) => row.key === item.key);
    const item = data[index];
    data.splice(index, 1, {
      ...item,
      ...row,
    });
    // this.setState({ dataSource: data }, () => {
    //   this.triggerChange(data);
    // });
  };

  triggerChange = (data) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  render() {
    const { dataSource, editableKeys, started } = this.state;

    const columns = [
      {
        title: '请求方式',
        dataIndex: 'method',
        editable: true,
        width: '30%',
        formItemProps: () => ({
          rules: [{ required: true, message: '此项为必填项' }],
        }),
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
        formItemProps: () => ({
          rules: [{ required: true, message: '此项为必填项' }],
        }),
      },
      {
        title: '操作',
        dataIndex: 'key',
        width: '25%',
        render: (_, record) => {
          if (dataSource.length === 0) {
            return null;
          }
          return (
            <Popconfirm
              title="确定要删除该数据吗?"
              onConfirm={() => this.handleDeleteOneItem(record)}
            >
              <a>删除</a>
            </Popconfirm>
          );
        },
        editable: false,
      },
    ];

    const mregedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div
        className={styles.tableList}
        // formRef={this.formRef}
        // initialValues={{
        //   resources: dataSource,
        // }}
        // validateTrigger="onBlur"
      >
        <EditableProTable
          name="resources"
          rowKey={(record) => record.key}
          bordered
          loading={false}
          dataSource={dataSource}
          columns={mregedColumns}
          // columns={this.columns}
          pagination={false}
          actionRef={this.actionRef}
          formRef={this.editorFormRef}
          editableFormRef={this.editableFormRef}
          editable={{
            type: 'multiple',
          }}
          maxLength={10}
          recordCreatorProps={{
            position: 'top',
            newRecordType: 'dataSource',
            record: () => {
              let oneitem = {
                key: newUUID(),
                editable: true,
              };
              dataSource.push(oneitem);
              this.setState({
                dataSource,
              });
              console.log(' ------ == == == recordCreatorProps dataSource ', dataSource.length);
              console.log(
                ' --- --- = ===== recordCreatorProps dataSource ',
                JSON.stringify(dataSource)
              );
              return oneitem;
            },
            creatorButtonText: ' 新 增',
          }}
        />
      </div>
    );
  }
}

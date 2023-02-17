import React, { PureComponent } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio,
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import { fillFormKey, newUUID } from '@/utils/utils';
import { EditableCell, EditableFormRow } from './EditableCell';

import styles from './index.less';

export default class MenuActionResource extends PureComponent {
  actionRef = React.createRef();
  editorFormRef = React.createRef();
  editableFormRef = React.createRef();

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '请求方式',
        dataIndex: 'method',
        editable: true,
        width: '30%',
      },
      {
        title: '请求路径',
        dataIndex: 'path',
        editable: true,
        width: '45%',
      },
      {
        title: '操作',
        dataIndex: 'key',
        width: '25%',
        render: (_, record) => {
          const { dataSource } = this.state;
          if (dataSource.length === 0) {
            return null;
          }
          return (
            <Popconfirm title="确定要删除该数据吗?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          );
        },
        editable: false,
      },
    ];

    this.state = {
      dataSource: fillFormKey(props.value),
      addVisible: false,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, dataSource: fillFormKey(nextProps.value) };
    }
    return state;
  }

  handleAddCancel = () => {
    this.setState({ addVisible: false });
  };

  handleDelete = key => {
    const { dataSource } = this.state;
    const data = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  handleSave = row => {
    const { dataSource } = this.state;
    const data = [...dataSource];
    const index = data.findIndex(item => row.key === item.key);
    const item = data[index];
    data.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  render() {
    const { dataSource } = this.state;

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div className={styles.tableList}>
        <EditableProTable
          rowKey={record => {
            if (record.id) {
              return record.id;
            }
            return record.no;
          }}
          bordered
          loading={false}
          dataSource={dataSource}
          columns={columns}
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
                no: dataSource.length + 1, // (Math.random() * 1000000).toFixed(0),
              };
              dataSource.push(oneitem);
              this.setState({
                dataSource,
              });
              return oneitem;
            },
            creatorButtonText: ' 新 增',
          }}
        />
      </div>
    );
  }
}

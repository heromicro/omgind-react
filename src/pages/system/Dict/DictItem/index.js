import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, Divider, Badge, message } from 'antd';

import { fillFormKey } from '@/utils/utils';

import FormDialog from './FormDialog';

import styles from './index.less';

class DictItem extends PureComponent {
  state = {
    dataSource: [],
    formVisible: false,
    formData: {},
  };

  static getDerivedStateFromProps(nextProps, state) {
    // console.log(' ---- ssss === nextProps ', nextProps);

    if ('value' in nextProps) {
      return {
        ...state,
        dataSource: fillFormKey(nextProps.value),
      };
    }
    return state;
  }

  handleDelete = (key) => {
    const { dataSource } = this.state;
    const data = dataSource.filter((item) => item.key !== key);
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  handleEdit = (item) => {
    this.setState({
      formVisible: true,
      formData: item,
    });
  };

  handleFormCancel = () => {
    this.setState({ formVisible: false });
  };

  handleFormSubmit = (formData) => {
    console.log(' ===== ----- ===== sss formData ', formData);

    const { dataSource } = this.state;
    const data = [...dataSource];

    console.log(' ===== ----- ===== sss data ', data);
    let exists = false;
    // check the same label or the same value
    let labels = [];
    let vals = [];
    for (let i = 0; i < data.length; i += 1) {
      labels.push(data[i].label);
      vals.push(data[i].value);
    }

    console.log(' ===== ----- ===== data： ', data);

    if (!formData.id) {
      console.log(' ---- ggggggg === ', labels);
      console.log(' ---- ggggggg === ', vals);

      /* eslint-disable */
      if (labels.includes(formData.label)) {
        message.error(`显示值: "${formData.label}" 已存在`);
        return;
      } else if (vals.includes(formData.value)) {
        message.error(`字典值: "${formData.value}" 已存在"`);
        return;
      }
      /* eslint-disable */
    }

    for (let i = 0; i < data.length; i += 1) {
      if (!(!formData.id && !data[i].id) && data[i].id === formData.id) {
        console.log(' ------ ggggggg === ', formData.id);
        console.log(' ------ ggggggg === 222 ', data[i].id);

        exists = true;
        // data[i] = { key: formData.label, is_active:formData.is_active, ...formData };
        data[i] = { key: formData.label, ...formData };
      } else {
        /* eslint-disable */

        if (data[i].label === formData.label && data[i].id !== formData.id) {
          message.error(`显示值:"${data[i].label}"已存在, 对应的字典值:"${data[i].value}"`);
          return;
        } else if (data[i].value === formData.value && data[i].id !== formData.id) {
          message.error(`字典值:"${data[i].value}" 已存在, 对应的显示值:"${data[i].label}"`);
          return;
        }
        /* eslint-enable */
      }
    }

    if (!exists) {
      // data.push({ key: formData.label, is_active:formData.is_active, ...formData });
      data.push({ key: formData.label, ...formData });
    }

    this.setState({ dataSource: data, formVisible: false }, () => {
      this.triggerChange(data);
    });
  };

  handleAdd = () => {
    this.setState({ formVisible: true, formData: {} });
  };

  triggerChange = (data) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  render() {
    const { dataSource, formData, formVisible } = this.state;

    let s = JSON.stringify(formData);

    // console.log(' --- ==== -444444-- ', s);

    const columns = [
      {
        title: '显示值',
        dataIndex: 'label',
      },
      {
        title: '字典值',
        dataIndex: 'value',
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        render: (val) => {
          if (val) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '操作',
        dataIndex: 'key',
        render: (_, record) => [
          <a key="edit" href="#" onClick={() => this.handleEdit(record)}>
            编辑
          </a>,
          <Divider key="divivder0" type="vertical" />,
          <Popconfirm
            key="delete"
            title="确定要删除该数据吗?"
            onConfirm={() => this.handleDelete(record.key)}
          >
            <a href="#">删除</a>
          </Popconfirm>,
        ],
      },
    ];

    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Button onClick={this.handleAdd} size="small" type="primary">
            新增
          </Button>
        </div>
        <Table
          rowKey={(record) => record.key}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <FormDialog
          visible={formVisible}
          formData={formData}
          onSubmit={this.handleFormSubmit}
          onCancel={this.handleFormCancel}
        />
      </div>
    );
  }
}

export default DictItem;

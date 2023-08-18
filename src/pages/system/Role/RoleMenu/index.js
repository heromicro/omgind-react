import React, { PureComponent } from 'react';
import { Table } from 'antd';
import * as menuService from '@/services/sysmenu.svc';

import EditableCell from './EditableCell';

const checkAndAdd = (data, addData) => {
  const list = [...data];

  for (let i = 0; i < addData.length; i += 1) {
    let exists = false;
    for (let j = 0; j < list.length; j += 1) {
      if (list[j].menu_id === addData[i].id) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      const item = {
        menu_id: addData[i].id,
        actions: addData[i].actions ? addData[i].actions.map((v) => v.id) : [],
      };
      list.push(item);
    }
  }

  return list;
};

const cancelSelected = (data, selectedRows) => {
  const list = [];
  for (let i = 0; i < data.length; i += 1) {
    let exists = false;
    for (let j = 0; j < selectedRows.length; j += 1) {
      if (data[i].menu_id === selectedRows[j].id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      list.push(data[i]);
    }
  }
  return list;
};

export default class RoleMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: '35%',
      },
      {
        title: '动作权限',
        dataIndex: 'actions',
        editable: true,
      },
    ];

    this.state = {
      menuData: [],
      dataSource: props.value || [],
    };
  }

  componentDidMount() {
    menuService.queryTree().then((data) => {
      const { burden } = data;
      const list = burden.list || [];
      this.setState({ menuData: this.fillData(list) });
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        dataSource: nextProps.value || [],
      };
    }
    return state;
  }

  fillData = (data) => {
    const newData = [...data];
    for (let i = 0; i < newData.length; i += 1) {
      const { children } = newData[i];
      const item = { ...newData[i], hasChild: children && children.length > 0 };
      if (item.hasChild) {
        item.children = this.fillData(children);
      }
      newData[i] = item;
    }
    return newData;
  };

  handleSave = (record, dataIndex, values) => {
    const { dataSource } = this.state;
    const data = [...dataSource];
    const index = data.findIndex((item) => item.menu_id === record.id);
    let item = data[index];
    if (!item) {
      item = {
        menu_id: record.id,
        dataIndex: values,
      };
    } else {
      item[dataIndex] = values;
    }
    data.splice(index, 1, {
      ...item,
    });
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  triggerChange = (data) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  expandAllChild = (data) => {
    let child = [];
    for (let i = 0; i < data.length; i += 1) {
      child.push(data[i]);
      if (data[i].children) {
        child = [...child, ...this.expandAllChild(data[i].children)];
      }
    }
    return child;
  };

  handleSelectedRow = (record, selected) => {
    let selectedRows = [record];
    if (record.children) {
      selectedRows = [...selectedRows, ...this.expandAllChild(record.children)];
    }

    const { dataSource } = this.state;
    let list = [];
    if (selected) {
      list = checkAndAdd(dataSource, selectedRows);
    } else {
      list = cancelSelected(dataSource, selectedRows);
    }

    this.setState({ dataSource: list }, () => {
      this.triggerChange(list);
    });
  };

  handleSelectAll = (selected, selectRows) => {
    let list = [];

    console.log(' +++++++ --- elected: ', selected);
    console.log(' +++++++ --- selectRows: ', selectRows);

    if (selected) {
      list = selectRows
        .map((vv) => {
          if (!vv) {
            console.log(' ---- ==== vvv ', vv);
            return null;
          }
          const item = {
            menu_id: vv.id,
            actions: vv.actions ? vv.actions.map((v) => v.id) : [],
          };
          return item;
        })
        .filter(Boolean);
    }
    this.setState({ dataSource: list }, () => {
      this.triggerChange(list);
    });
  };

  render() {
    const { dataSource, menuData } = this.state;

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          data: dataSource,
          dataIndex: col.dataIndex,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      menuData.length > 0 && (
        <Table
          bordered
          defaultExpandAllRows
          rowSelection={{
            selectedRowKeys: dataSource.map((v) => v.menu_id),
            onSelect: this.handleSelectedRow,
            onSelectAll: this.handleSelectAll,
          }}
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={menuData}
          columns={columns}
          pagination={false}
        />
      )
    );
  }
}

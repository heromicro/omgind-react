import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import { showPButtons } from '@/utils/uiutil';
import { makeupSortKey } from '@/utils/urlutil';

import { formatDate } from '@/utils/datetime';
import AddressCard from './addressCard';

import styles from './addressList.less';

@connect((state) => ({
  loading: state.loading.models.sysaddress,
  sysaddress: state.sysaddress,
}))
class AddressList extends PureComponent {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.refetch();
  }

  onItemDisableClick = (item) => {
    this.dispatch({
      type: 'sysaddress/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'sysaddress/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'sysaddress/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'sysaddress/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onItemDelClick = (item) => {
    Modal.confirm({
      title: `确定删除【基础示例数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  onDelOKClick(id) {
    this.dispatch({
      type: 'sysaddress/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  onMainTableSelectRow = (record, selected) => {
    const keys = [];
    const rows = [];
    if (selected) {
      keys.push(record.id);
      rows.push(record);
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onMainTableChange = (pagination) => {
    this.refetch({ pagination });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    this.formRef.current.resetFields();
    this.refetch();
  };

  onSearchFormSubmit = (values) => {
    if (!values.queryValue) {
      return;
    }

    this.refetch({
      search: values,
      pagination: {},
    });
    this.clearSelectRows();
  };

  onDataFormSubmit = (data) => {
    this.dispatch({
      type: 'sysaddress/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'sysaddress/changeModalFormVisible',
      payload: false,
    });
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  refetch = ({ search = {}, pagination = {} } = {}) => {
    console.log(' --------- ===== 9999 == ');
    this.dispatch({
      type: 'sysaddress/fetch',
      search,
      pagination,
    });
  };

  renderDataForm() {
    return <AddressCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    return (
      <Form ref={this.formRef} onFinish={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="queryValue">
              <Input placeholder="请输入需要查询的内容" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden', paddingTop: 4 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      sysaddress: {
        data: { list, pagination },
      },
    } = this.props;

    console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
      {
        title: '省/市',
        dataIndex: 'provice',
      },
      {
        title: '市/区',
        dataIndex: 'city',
      },
      {
        title: '县/区',
        dataIndex: 'county',
      },
      {
        title: '详细地址',
        dataIndex: 'daddr',
        search: false,
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'mobile',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        search: false,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        search: false,
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '地址管理', href: '/system/address' }];

    return (
      <PageHeaderLayout title="地址管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <ProTable
                rowSelection={{
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
                }}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                request={(params, sort, filter) => {

                  let nsort = makeupSortKey(sort)
                  
                  this.refetch({
                    search:{...params, ...nsort},
                    pagination:{current: params.current, pageSize: params.pageSize}});

                }}
                onChange={this.onMainTableChange}
                size="small"

                toolBarRender={() =>
                  showPButtons(
                    selectedRows,
                    this.onAddClick,
                    this.onItemEditClick,
                    this.onItemDelClick,
                    this.onItemEnableClick,
                    this.onItemDisableClick
                  )
                }

              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default AddressList;

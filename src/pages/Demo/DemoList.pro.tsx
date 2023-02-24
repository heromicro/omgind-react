import React, { PureComponent } from 'react';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import { formatDate } from '@/utils/datetime';
import DemoCard from './DemoCard';

import styles from './DemoList.less';

@connect((state) => ({
  loading: state.loading.models.demo,
  demo: state.demo,
}))
class DemoList extends PureComponent {
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
      type: 'demo/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'demo/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'demo/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'demo/loadForm',
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
      type: 'demo/del',
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
      type: 'demo/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'demo/changeModalFormVisible',
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
      type: 'demo/fetch',
      search,
      pagination,
    });
  };

  renderDataForm() {
    return <DemoCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
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
      demo: {
        data: { list, pagination },
      },
    } = this.props;

    // console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'memo',
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
        title: '创建时间',
        dataIndex: 'created_at',
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '演示用例' }, { title: '基础示例', href: '/example/demo' }];

    return (
      <PageHeaderLayout title="基础示例" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  onClick={() => this.onItemEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  danger
                  type="primary"
                  onClick={() => this.onItemDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                !selectedRows[0].is_active && (
                  <PButton
                    key="enable"
                    code="enable"
                    onClick={() => this.onItemEnableClick(selectedRows[0])}
                  >
                    启用
                  </PButton>
                ),
                selectedRows[0].is_active === true && (
                  <PButton
                    key="disable"
                    code="disable"
                    danger
                    onClick={() => this.onItemDisableClick(selectedRows[0])}
                  >
                    禁用
                  </PButton>
                ),
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
                }}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.onMainTableChange}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default DemoList;

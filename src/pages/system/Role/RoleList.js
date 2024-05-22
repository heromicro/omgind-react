import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { showPButtons } from '@/utils/uiutil';

import { formatDate } from '@/utils/datetime';
import RoleCard from './RoleCard';

import styles from './RoleList.less';

@connect((state) => ({
  sysrole: state.sysrole,
  loading: state.loading.models.sysrole,
}))
class RoleList extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'sysrole/fetch',
      search: {},
      pagination: {},
    });
  }

  onItemDisableClick = (item) => {
    this.dispatch({
      type: 'sysrole/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'sysrole/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onAddClick = () => {
    this.dispatch({
      type: 'sysrole/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'sysrole/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onItemDelClick = (item) => {
    Modal.confirm({
      title: `确定删除【角色数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.id),
    });
  };

  refetch = ({ search = {}, pagination = {} } = {}) => {
    console.log(' --------- ===== 9999 == ');
    this.dispatch({
      type: 'sysrole/fetch',
      search,
      pagination,
    });
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
    this.dispatch({
      type: 'sysrole/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    this.formRef.current.resetFields();

    this.dispatch({
      type: 'sysrole/fetch',
      search: {},
      pagination: {},
    });
  };

  handleSearchFormSubmit = (val) => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        this.dispatch({
          type: 'sysrole/fetch',
          search: values,
          pagination: {},
        });
        this.clearSelectRows();
      })
      .catch((err) => {});
  };

  handleDataFormSubmit = (data) => {
    this.dispatch({
      type: 'sysrole/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'sysrole/changeModalFormVisible',
      payload: false,
    });
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'sysrole/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return <RoleCard onCancel={this.handleDataFormCancel} onSubmit={this.handleDataFormSubmit} />;
  }

  renderSearchForm() {
    return (
      <Form ref={this.formRef} onFinish={this.handleSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="q">
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
      sysrole: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '排序值',
        dataIndex: 'sort',
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
        title: '创建时间',
        dataIndex: 'created_at',
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: '180px',
        ellipsis: true,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '角色管理', href: '/system/role' }];

    return (
      <PageHeaderLayout title="角色管理" breadcrumbList={breadcrumbList}>
        <Card size="small" bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Space>
                {showPButtons(
                  selectedRows,
                  this.onAddClick,
                  this.onItemEditClick,
                  this.onItemDelClick,
                  this.onItemEnableClick,
                  this.onItemDisableClick
                )}
              </Space>
              <Space>
                <Button shape="circle" icon={<ReloadOutlined onClick={() => this.refetch()} />} />
              </Space>
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

export default RoleList;

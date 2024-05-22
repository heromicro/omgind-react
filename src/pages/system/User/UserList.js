import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import { showPButtons } from '@/utils/uiutil';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDate } from '@/utils/datetime';
import { checkActionPermission } from '@/utils/checkPermission';

import RoleMSelect from '@/components/selectors/RoleMSelect';

import UserCard from './UserCard';
import UserDetail from './UserDetail';

import styles from './UserList.less';

@connect((state) => ({
  loading: state.loading.models.sysuser,
  sysuser: state.sysuser,
  global: state.global,
}))
class UserList extends PureComponent {
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
      type: 'sysuser/fetch',
      search: {},
      pagination: {},
    });
  }

  onItemDisableClick = (item) => {
    this.dispatch({
      type: 'sysuser/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'sysuser/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'sysuser/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'sysuser/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onDelOKClick(id) {
    this.dispatch({
      type: 'sysuser/del',
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

  onItemDelClick = (item) => {
    Modal.confirm({
      title: `确定删除【用户数据：${item.user_name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  refetch = ({ search = {}, pagination = {} } = {}) => {
    console.log(' --------- ===== 9999 == ');
    this.dispatch({
      type: 'sysuser/fetch',
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
      type: 'sysuser/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    this.formRef.current.resetFields();
    this.refetch();
  };

  onSearchFormSubmit = (values) => {
    if (!values.q && !values.role_ids) {
      return;
    }

    const formData = { ...values };
    if (formData.role_ids) {
      formData.role_ids = formData.role_ids.map((v) => v.role_id).join(',');
    }
    this.refetch({ search: formData });
    this.clearSelectRows();
  };

  onDataFormSubmit = (data) => {
    this.dispatch({
      type: 'sysuser/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'sysuser/changeModalFormVisible',
      payload: false,
    });
  };

  onShowDetailInfo = (item) => {
    console.log(' ----- === == === --- ', item);
    this.dispatch({
      type: 'sysuser/loadDetail',
      payload: {
        record: item,
      },
    });
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderDataForm() {
    return <UserCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    return (
      <Form ref={this.formRef} onFinish={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="模糊查询" name="q">
              <Input placeholder="请输入需要查询的内容" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属角色" name="role_ids" style={{ width: '100%' }}>
              <RoleMSelect style={{ width: '100%' }} />
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
      sysuser: {
        data: { list, pagination },
      },
      global: { menuPaths },
    } = this.props;

    const { selectedRows, selectedRowKeys } = this.state;
    let hasview = checkActionPermission(menuPaths, 'view');

    const columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
        render: (val, record, index) => {
          return hasview ? (
            <a
              onClick={() => {
                this.onShowDetailInfo(record);
              }}
            >
              {val}
            </a>
          ) : (
            val
          );
        },
      },
      {
        title: '真实姓名',
        dataIndex: 'real_name',
        render: (val, record, index) => `${record.last_name} ${record.first_name}`,
      },
      {
        title: '角色名称',
        dataIndex: 'roles',
        render: (val, record, index) => {
          if (!val || val.length === 0) {
            return <span>-</span>;
          }
          const names = [];
          for (let i = 0; i < val.length; i += 1) {
            names.push(val[i].name);
          }
          return <span>{names.join(' | ')}</span>;
        },
      },
      {
        title: '用户状态',
        dataIndex: 'is_active',
        render: (val) => {
          if (val) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
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

    const breadcrumbList = [{ title: '系统管理' }, { title: '用户管理', href: '/system/user' }];

    return (
      <PageHeaderLayout title="用户管理" breadcrumbList={breadcrumbList}>
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

export default UserList;

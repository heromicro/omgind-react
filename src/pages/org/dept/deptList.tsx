import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { history } from 'umi';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { OrgDeptItem } from '@/scheme/orgdept';

import PButton from '@/components/PermButton';
import { showPButtons } from '@/utils/uiutil';
import { makeupSortKey } from '@/utils/urlutil';

import { formatDate } from '@/utils/datetime';

import DeptDetail from './deptDetail';
import DeptDrawerForm from './deptDrawerForm';

import styles from './deptList.less';

@connect((state) => ({
  cuser: state.global.user,
  loading: state.loading.models.orgdept,
  orgdept: state.orgdept,
}))
class DeptList extends PureComponent {
  formRef = React.createRef();

  searchFormRef = React.createRef();
  actionRef = React.createRef();

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
      type: 'orgdept/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'orgdept/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'orgdept/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    console.log(' ------ ======= ssss ');

    this.dispatch({
      type: 'orgdept/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onItemDelClick = (item) => {
    Modal.confirm({
      title: `确定删除【地址数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  onDelOKClick(id) {
    this.dispatch({
      type: 'orgdept/del',
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

  onMainTableSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRows: OrgDeptItem[],
    info
  ) => {
    // console.log(' ======== ======== === newSelectedRowKeys ', newSelectedRowKeys);
    // console.log(' ======== ======== === newSelectedRows ', newSelectedRows);
    // console.log(' ======== ======== === info ', info);
    // console.log(' ======== ======== === info.type ', info.type);

    this.setState({ selectedRowKeys: newSelectedRowKeys, selectedRows: newSelectedRows });
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
    const { location } = this.props;
    history.push({ pathname: location.pathname });

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
    // this.dispatch({
    //   type: 'orgdept/submit',
    //   payload: data,
    // });
    const { dispatch } = this.props;

    dispatch({
      type: 'orgdept/submit',
      payload: data,
      callback: (success, burden) => {
        if (success) {
          const { location } = this.props;
          history.push({
            pathname: location.pathname,
            search: `created_at__order=desc&after=${burden.id}`,
          });
          this.refetch();
        }
      },
    });

    this.clearSelectRows();
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  refetch = ({ search = {}, pagination = {} } = {}) => {
    console.log(' --------- ===== 9999 == ');
    this.dispatch({
      type: 'orgdept/fetch',
      search,
      pagination,
    });
  };

  onDetailDrawerClose = () => {
    console.log(' --- --- === == -- cancel');

    this.dispatch({
      type: 'orgdept/changeDetailDrawerOpen',
      payload: false,
    });
  };

  onClickShowDetail = (item) => {
    this.dispatch({
      type: 'orgdept/loadDetail',
      payload: {
        record: item,
      },
    });
  };

  renderItemDetail() {
    return (
      <DeptDetail width={850} onClose={this.onDetailDrawerClose} onAddClick={this.onAddClick} />
    );
  }

  renderDrawerForm() {
    return <DeptDrawerForm width={850} onSubmit={this.onDataFormSubmit} />;
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
      orgdept: {
        data: { list, pagination },
      },
    } = this.props;
    // console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns: ProColumns<OrgDeptItem>[] = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '助记码',
        dataIndex: 'code',
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        valueType: 'select',
        valueEnum: {
          true: { text: '有效', status: 'Default' },
          false: { text: '失效', status: 'Error' },
        },
        render: (_, entity, row) => {
          if (entity.is_active) {
            return <Tag color="#87d068">有效</Tag>;
          }
          return <Tag color="#f50">失效</Tag>;
        },
      },
      {
        title: '所属公司',
        dataIndex: 'org_name',
        hideInSearch: true,
        render: (_, entity, row) => {
          if (entity.org) {
            return entity.org.name;
          }
          return '';
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        hideInSearch: true,
        sorter: { multiple: 2 },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        hideInSearch: true,

        sorter: { multiple: 1 },

        render: (_, entity, row) => (
          <span>{formatDate(entity.created_at, 'YYYY-MM-DD HH:mm')}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'option',
        hideInSearch: true,
        fixed: 'right',
        width: '60px',
        render: (val, record, row) => {
          return (
            <PButton
              type="link"
              code="view"
              onClick={() => {
                this.onClickShowDetail(record);
              }}
            >
              查看
            </PButton>
          );
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '企业管理' }, { title: '部门管理', href: '/organ/dept' }];

    return (
      <PageHeaderLayout title="部门管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <ProTable<OrgDeptItem>
                actionRef={this.actionRef}
                formRef={this.searchFormRef}
                scroll={{ x: 'max-content' }}
                rowSelection={{
                  fixed: 'left',
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
                  onChange: this.onMainTableSelectChange,
                }}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                request={(params, sort, filter) => {
                  let nsort = makeupSortKey(sort);

                  this.refetch({
                    search: { ...params, ...nsort },
                    pagination: { current: params.current, pageSize: params.pageSize },
                  });
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
        {this.renderItemDetail()}
        {this.renderDrawerForm()}
      </PageHeaderLayout>
    );
  }
}

export default DeptList;

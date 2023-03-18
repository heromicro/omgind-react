import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { history } from 'umi';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { OrgStaffItem } from '@/scheme/orgstaff';

import PButton from '@/components/PermButton';
import { showPButtons } from '@/utils/uiutil';
import { makeupSortKey } from '@/utils/urlutil';

import { formatDate } from '@/utils/datetime';

import StaffDetail from './staffDetail';
import StaffDrawerForm from './staffDrawerForm';

import styles from './staffList.less';

@connect((state) => ({
  loading: state.loading.models.orgstaff,
  orgstaff: state.orgstaff,
}))
class StaffList extends PureComponent {
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
      type: 'orgstaff/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'orgstaff/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'orgstaff/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    console.log(' ------ ======= ssss ');

    this.dispatch({
      type: 'orgstaff/loadForm',
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
      type: 'orgstaff/del',
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
    //   type: 'orgstaff/submit',
    //   payload: data,
    // });
    const { dispatch } = this.props;

    dispatch({
      type: 'orgstaff/submit',
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
      type: 'orgstaff/fetch',
      search,
      pagination,
    });
  };

  onDetailDrawerClose = () => {
    console.log(' --- --- === == -- cancel');

    this.dispatch({
      type: 'orgstaff/changeDetailDrawerOpen',
      payload: false,
    });
  };

  onClickShowDetail = (item) => {
    this.dispatch({
      type: 'orgstaff/loadDetail',
      payload: {
        record: item,
      },
    });
  };

  renderItemDetail() {
    return (
      <StaffDetail width={850} onClose={this.onDetailDrawerClose} onAddClick={this.onAddClick} />
    );
  }

  renderDrawerForm() {
    return <StaffDrawerForm width={850} onSubmit={this.onDataFormSubmit} />;
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
      orgstaff: {
        data: { list, pagination },
      },
    } = this.props;

    // console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns: ProColumns<OrgStaffItem>[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        hideInSearch: true,
        render: (val, entity, row) => {
          return `${entity.last_name} ${entity.first_name}`;
        },
      },
      {
        title: '电话',
        dataIndex: 'mobile',
      },
      {
        title: '出生日期',
        dataIndex: 'birth_date',
        render: (_, entity, row) => <span>{formatDate(entity.birth_date, 'YYYY-MM-DD')}</span>,
      },
      {
        title: '身份证号',
        dataIndex: 'iden_no',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        valueEnum: {
          M: { text: '男' },
          F: { text: '女' },
        },
        render: (val, entity, row) => {
          switch (entity.gender) {
            case 'M':
              return '男';
            case 'F':
              return '女';
            default:
              return '';
          }
          return '';
        },
      },
      {
        title: '入职日期',
        dataIndex: 'entry_date',
        render: (_, entity, row) => <span>{formatDate(entity.entry_date, 'YYYY-MM-DD')}</span>,
      },
      {
        title: '转正日期',
        dataIndex: 'regular_date',
        render: (_, entity, row) => <span>{formatDate(entity.regular_date, 'YYYY-MM-DD')}</span>,
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
        title: '排序',
        dataIndex: 'sort',
        search: false,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        hideInSearch: true,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        search: false,
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

    const breadcrumbList = [{ title: '系统管理' }, { title: '地址管理', href: '/system/address' }];

    return (
      <PageHeaderLayout title="地址管理" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <ProTable<OrgStaffItem>
                actionRef={this.actionRef}
                formRef={this.searchFormRef}
                scroll={{ x: 'max-content' }}
                rowSelection={{
                  fixed: 'left',
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
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

export default StaffList;

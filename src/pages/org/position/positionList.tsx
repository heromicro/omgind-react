import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { history } from 'umi';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { OrgPositionItem } from '@/scheme/orgposition';

import PButton from '@/components/PermButton';
import { showPButtons } from '@/utils/uiutil';
import { makeupSortKey } from '@/utils/urlutil';

import { formatDate } from '@/utils/datetime';

import PositionDetail from './positionDetail';
import PositionDrawerForm from './positionDrawerForm';

import styles from './positionList.less';

@connect((state) => ({
  loading: state.loading.models.orgposition,
  orgposition: state.orgposition,
}))
class PositionList extends PureComponent {
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
      type: 'orgposition/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'orgposition/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'orgposition/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    console.log(' ------ ======= ssss ');

    this.dispatch({
      type: 'orgposition/loadForm',
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
      type: 'orgposition/del',
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
    //   type: 'orgposition/submit',
    //   payload: data,
    // });
    const { dispatch } = this.props;

    dispatch({
      type: 'orgposition/submit',
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
      type: 'orgposition/fetch',
      search,
      pagination,
    });
  };

  onDetailDrawerClose = () => {
    console.log(' --- --- === == -- cancel');

    this.dispatch({
      type: 'orgposition/changeDetailDrawerOpen',
      payload: false,
    });
  };

  onClickShowDetail = (item) => {
    this.dispatch({
      type: 'orgposition/loadDetail',
      payload: {
        record: item,
      },
    });
  };

  renderItemDetail() {
    return (
      <PositionDetail width={850} onClose={this.onDetailDrawerClose} onAddClick={this.onAddClick} />
    );
  }

  renderDrawerForm() {
    return <PositionDrawerForm width={850} onSubmit={this.onDataFormSubmit} />;
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
      orgposition: {
        data: { list, pagination },
      },
    } = this.props;

    // console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns: ProColumns<OrgPositionItem>[] = [
      {
        title: '国',
        dataIndex: 'country',
        fixed: 'left',
        hideInForm: true,
        hideInSearch: true,
      },
      {
        title: '省/市',
        dataIndex: 'province',
        hideInForm: true,
        hideInSearch: true,
      },
      {
        title: '省/市',
        dataIndex: 'province',
        hideInTable: true,
        renderFormItem: (item, config, form) => {
          const { type, defaultRender } = config;
          if (config.type === 'form') {
            return null;
          }

          // console.log(' -------- ==== ----- === item    ', item);
          // console.log(' -------- ==== ----- === config  ', config);

          return defaultRender(item);
        },
      },
      {
        title: '市/区',
        dataIndex: 'city',
        hideInForm: true,
        hideInSearch: true,
      },
      {
        title: '市/区',
        dataIndex: 'city',
        hideInTable: true,
      },
      {
        title: '县/区',
        dataIndex: 'county',
        hideInForm: true,
        hideInSearch: true,
      },
      {
        title: '县/区',
        dataIndex: 'county',
        hideInTable: true,
      },
      {
        title: '详细地址',
        dataIndex: 'daddr',
        search: false,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        hideInSearch: true,
        render: (val, record, row) => {
          return `${record.last_name} ${record.first_name}`;
        },
      },
      {
        title: '电话',
        dataIndex: 'mobile',
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
        title: '创建时间',
        dataIndex: 'created_at',
        search: false,
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
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
              <ProTable<OrgPositionItem>
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

export default PositionList;

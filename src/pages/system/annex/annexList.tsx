import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Tooltip, Modal, Badge, Tag, Space } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from 'umi';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import { SysAnnexItem } from '@/scheme/sysannex.sch';

import { checkActionPermission } from '@/utils/checkPermission';

import PButton from '@/components/PermButton';
import { showPButtons } from '@/utils/uiutil';
import { makeupSortKey } from '@/utils/urlutil';

import { formatDate } from '@/utils/datetime';

import AnnexDetail from './annexDetail';
import AnnexDrawerForm from './annexDrawerForm';

import styles from './annexList.less';

@connect((state) => ({
  loading: state.loading.models.sysannex,
  sysannex: state.sysannex,
  global: state.global,
}))
class AnnexList extends PureComponent {
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
      type: 'sysannex/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'sysannex/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'sysannex/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = (item = null) => {
    console.log(' ---gg--- ======= ssss item ', item);

    this.dispatch({
      type: 'sysannex/loadForm',
      payload: {
        type: item ? 'C' : 'A',
        id: item ? item.id : null,
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
      type: 'sysannex/del',
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
    newSelectedRows: SysAnnexItem[],
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
    if (!values.q) {
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
    //   type: 'sysannex/submit',
    //   payload: data,
    // });
    const { dispatch } = this.props;

    dispatch({
      type: 'sysannex/submit',
      payload: data,
      callback: (success) => {
        return { created_at__order: 'desc' };
        // if (success) {
        //   const { location } = this.props;
        //   history.push({
        //     pathname: location.pathname,
        //     search: `created_at__order=desc&after=${burden.id}`,
        //   });
        //   this.refetch();
        // }
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
      type: 'sysannex/fetch',
      search,
      pagination,
    });
  };

  onDetailDrawerClose = () => {
    console.log(' --- --- === == -- cancel');

    this.dispatch({
      type: 'sysannex/changeDetailDrawerOpen',
      payload: false,
    });
  };

  onShowDetailInfo = (item) => {
    this.dispatch({
      type: 'sysannex/loadDetail',
      payload: {
        record: item,
      },
    });
  };

  renderItemDetail() {
    return (
      <AnnexDetail width={850} onClose={this.onDetailDrawerClose} onAddClick={this.onAddClick} />
    );
  }

  renderDrawerForm() {
    return <AnnexDrawerForm width={850} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    return (
      <Form ref={this.formRef} onFinish={this.onSearchFormSubmit}>
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
      sysannex: {
        data: { list, pagination },
      },
      global: { menuPaths },
    } = this.props;

    // console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;
    let hasview = checkActionPermission(menuPaths, 'view');

    const columns: ProColumns<SysAnnexItem>[] = [
      {
        title: '查询',
        dataIndex: 'q',
        hideInTable: true,
        hideInForm: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
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
        title: '文件路径',
        dataIndex: 'file_path',
        hideInSearch: true,
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        valueType: 'select',
        valueEnum: {
          true: { text: '有效', status: 'Default' },
          false: { text: '失效', status: 'Error' },
        },
        sorter: { multiple: 3 },
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
        hideInSearch: true,
        width: '70px',
        sorter: { multiple: 2 },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        hideInSearch: true,
        sorter: { multiple: 1 },
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        hideInSearch: true,
        width: '180px',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'option',
        hideInSearch: true,
        fixed: 'right',
        width: '90px',
        render: (val, record, row) => {
          return (
            <Space>
              <PButton
                type="link"
                code="edit"
                onClick={() => {
                  this.onItemEditClick(record);
                }}
              >
                编辑
              </PButton>
              <PButton
                type="link"
                code="view"
                onClick={() => {
                  this.onShowDetailInfo(record);
                }}
              >
                查看
              </PButton>
            </Space>
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

    const breadcrumbList = [{ title: '资产管理' }, { title: '设备列表', href: '/asset/devices' }];

    return (
      <PageHeaderLayout title="设备列表" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <ProTable<SysAnnexItem>
                sticky
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
                toolBarRender={() => {
                  let buttons = showPButtons(
                    selectedRows,
                    this.onAddClick,
                    this.onItemEditClick,
                    this.onItemDelClick,
                    this.onItemEnableClick,
                    this.onItemDisableClick
                  );
                  if (selectedRows.length === 1) {
                    buttons.push(
                      <PButton
                        key="add"
                        code="add"
                        onClick={() => this.onAddClick(selectedRows[0])}
                      >
                        复制
                      </PButton>
                    );
                  }
                  return buttons;
                }}
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

export default AnnexList;

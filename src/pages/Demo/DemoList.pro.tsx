import React, { PureComponent } from 'react';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';

import { connect } from 'dva';
import dayjs from 'dayjs';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import { formatDate } from '@/utils/datetime';
import { DemoItem } from '@/scheme/demo';

import { showPButtons } from '@/utils/uiutil';
import { makeupSortKey } from '@/utils/urlutil';

import DemoCard from './DemoCard';

import styles from './DemoList.less';


@connect((state) => ({
  loading: state.loading.models.demo,
  demo: state.demo,
}))
class DemoList extends PureComponent {
  formRef = React.createRef();
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

  onMainTableSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows:DemoItem[], info) => {  
    console.log(" ======== ======== === newSelectedRowKeys ", newSelectedRowKeys)
    console.log(" ======== ======== === newSelectedRows ", newSelectedRows)
    console.log(" ======== ======== === info ", info)
    console.log(" ======== ======== === info.type ", info.type)

    this.setState({ selectedRowKeys: newSelectedRowKeys, selectedRows:newSelectedRows})

  }

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

  refetch = ({ search = {}, pagination = {}, sort = {} } = {}) => {
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

    console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns: ProColumns<DemoItem>[] = [
      {
        title: '编号',
        dataIndex: 'code',
        sorter: {compare:(a, b) => a.code - b.code, multiple: 1}
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'memo',
        search: false,
      },
      {
        title: '状态',
        disable: true,
        dataIndex: 'is_active',
        valueType: 'select',
        valueEnum: {
          // all: {text: '全部'},
          true: {text: '有效', status: 'Default'},
          false: {text: '失效', status: 'Error'},
        },
        // filters: true,
        // onFilter: true,
        // filters: [
        //   {text: '有效', value: true},
        //   {text: '失效', value: false}
        // ],
        // onFilter:  
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
        key: 'sort__show',
        hideInSearch: true,
        search: false,
        sorter: {compare:(a, b) => a.sort - b.sort, multiple: 1},
      },
      // {
      //   title: '排序',
      //   dataIndex: 'sort',
      //   hideInTable: true,
      //   // valueType: 'intrange',
      //   // search: {
      //   //   transform: (value:any) =>{
      //   //     return {sort__st: value[0], sort__ed:value[1]}
      //   //   }
      //   // },
      //   renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
      //     console.log(' ===== ---- ==== item:', _);
      //     console.log(' ===== ---- ==== config:', { type, defaultRender, ...rest });
      //     console.log(' ===== ---- ==== form:', form);
      //     if (type === 'form') {
      //       return null;
      //     }
      //     return defaultRender(_);
      //   },
      //   sorter: {compare:(a, b) => a.sort - b.sort, multiple: 1},
      // },
      {
        title: '创建时间',
        key: "create_at__show",
        dataIndex: 'created_at',
        hideInSearch: true,
        sorter: {compare: (a, b) => a.created_at - b.created_at, multiple: 2},
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        hideInTable: true,
        valueType: 'dateRange',
        // renderFormItem:{
        // },
        search: {
          transform: (value:any, namePath, allValues:any) => {
            let startd = dayjs(value[0]).startOf("day").valueOf(); 
            let entd = dayjs(value[1]).endOf('day').valueOf();   
            return {created_at__st:startd, created_at__ed:entd}
          }
        },
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
      // <PageHeaderLayout title="基础示例" breadcrumbList={breadcrumbList}>
      <PageHeaderLayout  title="基础示例"  breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}>
              {showPButtons(
                selectedRows,
                this.onAddClick,
                this.onItemEditClick,
                this.onItemDelClick,
                this.onItemEnableClick,
                this.onItemDisableClick
              )}
            </div> */}
            <div>
              <ProTable<DemoItem>
                actionRef={this.actionRef}
                bordered
                // cardProps={{title:"基础示例", bordered: true, }}
                rowSelection={{
                  selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                  onChange: this.onMainTableSelectChange,
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
                }}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                request={(params, sort, filter) => {

                  console.log(" --- ===== ----- == params ", params)
                  console.log(" --- ===== ----- == sort ", sort)
                  console.log(" --- ===== ----- == filter ", filter)
                  
                  let nsort = makeupSortKey(sort)
                  
                  this.refetch({
                    search:{...params, ...nsort},
                    pagination:{current: params.current, pageSize: params.pageSize}});
                }}
                onChange={this.onMainTableChange}
                size="small"
                // headerTitle={showPButtons(
                //   selectedRows,
                //   this.onAddClick,
                //   this.onItemEditClick,
                //   this.onItemDelClick,
                //   this.onItemEnableClick,
                //   this.onItemDisableClick
                // )}
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

export default DemoList;

// strain 拉紧；紧张；血统；笔调；（动植物或疾病的）品种
// kidney 肾；腰子；类型
// genre 类型；流派
// breed   品种；血统 繁殖；养育；引起，产生；教养
// cartoon 卡通；漫画；草图
// ikon 像；图标；插画
// idol  菩萨 偶像
// statue  雕像；塑像
// statuette  小雕像

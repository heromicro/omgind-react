import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Tag } from 'antd';
import type { ColumnsState, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { calculatePButtons } from '@/utils/uiutil';

import { formatDate } from '@/utils/datetime';
import { DistrctItem } from '@/scheme/district';

import { makeupSortKey } from '@/utils/urlutil';

import DistrictCard from './DistrictCard';

import styles from './DistrictList.less';

@connect((state) => ({
  loading: state.loading.models.district,
  district: state.district,
}))
class DistrictList extends PureComponent {
  formRef = React.createRef();
  actionRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      columnsStateMap:{},
    };
  }

  componentDidMount() {
    this.refetch();
  }

  onItemDisableClick = (item) => {
    this.dispatch({
      type: 'district/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'district/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'district/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'district/loadForm',
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
      type: 'district/del',
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
      type: 'district/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'district/changeModalFormVisible',
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
      type: 'district/fetch',
      search,
      pagination,
    });
  };

  renderDataForm() {
    return <DistrictCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
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
      district: {
        data: { list, pagination },
      },
      location,
    } = this.props;

    console.log(' -- --- == == = --- list: ', list);
    console.log(' -- --- == == = --- location: ', location);

    const { selectedRows, selectedRowKeys, columnsStateMap } = this.state;

// {"id": "01GSWGT66YKJTK652JWVJHYWSE","pid": "01GSWGT66SN259NQ5DEVENTFDZ","name": "北京","sname": "北京","abbr": null,"suffix": "市","st_code": "110000","initials": "bj","pinyin": "beijing","longitude": 116.405281,"latitude": 39.904987,"area_code": "","zip_code": "","merge_name": "北京市","merge_sname": "北京","extra": "","is_active": true,"sort": 2,"is_del": false,"is_main": false,"is_hot": true,"is_real": true,"is_direct": true,"is_leaf": false,"tree_id": 1,"tree_level": 2,"tree_left": 2,"tree_right": 39,"tree_path": "01GSWGT66SN259NQ5DEVENTFDZ","creator": "","created_at": "2023-02-23T14:47:41.634339+08:00","updated_at": "2023-02-23T14:47:41.911614+08:00" }

    const columns:ProColumns<DistrctItem>[] = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '简码',
        dataIndex: 'initials',
      },
      {
        title: '短称',
        dataIndex: 'sname',
      },
      {
        title: '拼音',
        dataIndex: 'pinyin',
      },
      {
        title: '行政名称',
        dataIndex: 'merge_name',
      },
      {
        title: '行政短称',
        dataIndex: 'merge_sname',
      },
      {
        title: '邮编',
        dataIndex: 'zip_code',
        hideInSearch: true,

      },
      {
        title: '区号',
        dataIndex: 'area_code',
        hideInSearch: true,
        
      },
      {
        title: '树层级',
        dataIndex: 'tree_level',
      },
      {
        title: '树左值',
        dataIndex: 'tree_left',
      },
      {
        title: '树右值',
        dataIndex: 'tree_right',
      },
      {
        title: '是否真实区',
        dataIndex: 'is_real',
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">真</Tag>;
          }
          return <Tag color="#f50">虚</Tag>;
        },
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">启用</Tag>;
          }
          return <Tag color="#f50">停用</Tag>;
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        hideInSearch: true,
      },
      {
        title: '备注',
        dataIndex: 'extra',
        hideInSearch: true,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '行政区域', href: '/system/district' }];

    return (
      <PageHeaderLayout title="行政区域" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              <ProTable<ProColumns>
                actionRef={this.actionRef}
                rowSelection={{
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
                }}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={list}
                columns={columns}
                columnsState={{
                  persistenceType: 'localStorage',
                  // persistenceKey: `columns-state-${location.pathname}`,
                  value: columnsStateMap,
                  onChange:(map: Record<string, ColumnsState>) => {
                    console.log(" ------ ====== map ",  map);
                    this.setState({
                      columnsStateMap: map
                    })

                  }
                }}
                pagination={paginationProps}
                request={(params, sort, filter) => {

                  let nsort = makeupSortKey(sort)
                  this.refetch({
                    search: {...params, ...nsort},
                    pagination:{current: params.current, pageSize: params.pageSize}
                  });
                  
                }}
                onChange={this.onMainTableChange}
                size="small"

                toolBarRender={() =>
                  calculatePButtons(
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

export default DistrictList;

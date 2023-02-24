import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Tag } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { calculatePButtons } from '@/utils/uiutil';

import { formatDate } from '@/utils/datetime';
import DistrictCard from './DistrictCard';

import styles from './DistrictList.less';

@connect((state) => ({
  loading: state.loading.models.district,
  district: state.district,
}))
class DistrictList extends PureComponent {
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
    } = this.props;

    console.log(' -- --- == == = --- list: ', list);

    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
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
        title: '层级',
        dataIndex: 'tree_level',
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
      },
      {
        title: '备注',
        dataIndex: 'extra',
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
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              {calculatePButtons(
                selectedRows,
                this.onAddClick,
                this.onItemEditClick,
                this.onItemDelClick,
                this.onItemEnableClick,
                this.onItemDisableClick
              )}
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

export default DistrictList;

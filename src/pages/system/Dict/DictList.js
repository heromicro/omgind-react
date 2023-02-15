import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Card, Input, Button, Table, Modal, Badge } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import PButton from '@/components/PermButton';
import { formatDate } from '@/utils/datetime';
import DictCard from './DictCard';

import styles from './DictList.less';

@connect(state => ({
  loading: state.loading.models.dict,
  dict: state.dict,
}))
@Form.create()
class DictList extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'dict/fetch',
      search: {},
      pagination: {},
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    console.log(' ----- +++ === dict ', action);

    dispatch(action);
  };

  onItemDisableClick = item => {
    this.dispatch({
      type: 'dict/changeStatus',
      payload: { id: item.id, status: 2 },
    });
  };

  onItemEnableClick = item => {
    this.dispatch({
      type: 'dict/changeStatus',
      payload: { id: item.id, status: 1 },
    });
  };

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  handleAddClick = () => {
    this.dispatch({
      type: 'dict/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  handleTableSelectRow = (record, selected) => {
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

  onSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }

      this.dispatch({
        type: 'dict/fetch',
        search: values,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  handleEditClick = item => {
    console.log(' - ====== editing ', item);

    this.dispatch({
      type: 'dict/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【字典数据：${item.name_cn}-${item.name_en}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.id),
    });
  };

  handleDataFormSubmit = data => {
    console.log(' ==== submit ---------  ');

    this.dispatch({
      type: 'dict/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'dict/changeFormVisible',
      payload: false,
    });
  };

  handleDelOKClick(id) {
    console.log(' - ====== deleting ', id);

    this.dispatch({
      type: 'dict/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  renderDataForm() {
    return <DictCard onCancel={this.handleDataFormCancel} onSubmit={this.handleDataFormSubmit} />;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="模糊查询">
              {getFieldDecorator('queryValue')(<Input placeholder="请输入需要查询的内容" />)}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="所属角色">{getFieldDecorator('roleIDs')(<RoleSelect />)}</Form.Item>
          </Col> */}
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
      dict: {
        data: { list, pagination },
      },
    } = this.props;

    console.log(' -++__+++++ ', list);

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '名称(中)',
        dataIndex: 'name_cn',
      },
      {
        title: '名称(英)',
        dataIndex: 'name_en',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => {
          if (val === 1) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '序号',
        dataIndex: 'sort',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: val => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '数据字典', href: '/system/dict' }];

    return (
      <PageHeaderLayout title="数据字典" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" type="primary" onClick={() => this.handleAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                selectedRows[0].status === 2 && (
                  <PButton
                    key="enable"
                    code="enable"
                    onClick={() => this.onItemEnableClick(selectedRows[0])}
                  >
                    启用
                  </PButton>
                ),
                selectedRows[0].status === 1 && (
                  <PButton
                    key="disable"
                    code="disable"
                    type="danger"
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
                  onSelect: this.handleTableSelectRow,
                }}
                loading={loading}
                rowKey={record => record.id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
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

export default DictList;

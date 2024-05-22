import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Badge, Typography, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { showPButtons } from '@/utils/uiutil';

import { formatDate } from '@/utils/datetime';

import DemoCard from './DemoCard';

import styles from './DemoList.less';

@connect((state) => ({
  loading: state.loading.models.demo,
  demo: state.demo,
}))
class DemoList extends PureComponent {
  formRef = React.createRef();

  tableFormRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      editingKey: '',
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

  onMainTableChange = (pagination) => {
    this.refetch({ pagination });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    this.formRef.current.resetFields();
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

  refetch = ({ search = {}, pagination = {} } = {}) => {
    console.log(' --------- ===== 9999 == ');
    this.dispatch({
      type: 'demo/fetch',
      search,
      pagination,
    });
  };

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

  renderDataForm() {
    return <DemoCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  render() {
    const {
      loading,
      demo: {
        data: { list, pagination },
      },
    } = this.props;
    const { editingKey } = this.state;

    console.log(' ----- ===== --- ', list);

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
      console.log(' ---- ===== ');
      this.tableFormRef.current.setFieldsValue({
        code: '',
        name: '',
        memo: '',
        is_active: '',
        ...record,
      });

      this.setState({
        editingKey: record.key,
      });
    };

    const save = async (key) => {
      console.log(' ---- ===== key : ', key);
    };

    const cancel = () => {
      this.setState({
        editingKey: '',
      });
    };

    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        editable: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        editable: true,
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
        editable: true,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = isEditing(record);

          return editable ? (
            <span>
              <Typography.Link
                onClick={() => {
                  console.log(' ----- === ---== save  record.id ', record.id);
                }}
              >
                save
              </Typography.Link>
            </span>
          ) : (
            <Typography.Link
              onClick={() => {
                console.log(' ----- === ---== edit  record.id ', record.id);
                edit(record);
              }}
            >
              Edit
            </Typography.Link>
          );
        },
        editable: false,
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
      <PageHeaderLayout title="基础示例" breadcrumbList={breadcrumbList}>
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
                // bordered
                rowSelection={{
                  selectedRowKeys,
                  onSelect: this.onMainTableSelectRow,
                }}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={list}
                columns={columns}
                // rowClassName="editable-row"
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

export default DemoList;

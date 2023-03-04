import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Card, Input, Button, Table, Modal, Layout, Tree, Badge } from 'antd';
// import { arrayToTree } from "performant-array-to-tree";

import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import { showPButtons } from '@/utils/uiutil';

import { formatDate } from '@/utils/datetime';
import MenuCard from './MenuCard';
import styles from './MenuList.less';

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class MenuList extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      treeSelectedKeys: [],
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'menu/fetchTree',
      // payload: {parentID: ""}
    });

    this.dispatch({
      type: 'menu/fetch',
      search: {},
      pagination: {},
    });
  }

  onItemDisableClick = (item) => {
    this.dispatch({
      type: 'menu/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'menu/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    console.log(' ------- --- == editing item ', item);

    this.dispatch({
      type: 'menu/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'menu/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onItemDelClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    Modal.confirm({
      title: `确定删除【菜单数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.id),
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
      type: 'menu/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    this.formRef.current.resetFields();
    this.dispatch({
      type: 'menu/fetch',
      search: { parent_id: this.getParentID() },
      pagination: {},
    });
  };

  onSearchFormSubmit = (values) => {
    this.dispatch({
      type: 'menu/fetch',
      search: {
        ...values,
        parent_id: this.getParentID(),
      },
      pagination: {},
    });
    this.clearSelectRows();
  };

  handleFormSubmit = (data) => {
    this.dispatch({
      type: 'menu/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'menu/changeModalFormVisible',
      payload: false,
    });
  };

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  getParentID = () => {
    const { treeSelectedKeys } = this.state;
    let parentID = '';
    if (treeSelectedKeys.length > 0) {
      [parentID] = treeSelectedKeys;
    }
    return parentID;
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'menu/del',
      payload: { id },
    });
    this.clearSelectRows();
  }

  /*
  handleTreeLoad = loadedKeys => {
    const {
      key,
      children,
      dataRef: { id },
    } = loadedKeys;
    if (children) {
      resolve();
      return;
    }

    this.dispatch({
      type: 'menu/fetchTree',
      // payload: {parentID: id}
    });

    console.log(' ------ ===== == ', loadedKeys);
  };
*/

  renderDataForm() {
    return <MenuCard onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />;
  }

  renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode
            title={item.name}
            key={item.id}
            dataRef={item}
            hasChildren={!item.is_leaf}
            isLeaf={item.is_leaf}
          >
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          title={item.name}
          key={item.id}
          hasChildren={!item.is_leaf}
          isLeaf={item.is_leaf}
          dataRef={item}
        />
      );
    });

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
      menu: {
        data: { list, pagination },
        treeData,
        expandedKeys,
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: 130,
        render: (val, row) => {
          if (row.is_show) {
            return <Badge status="default" text={val} />;
          }
          return <span>{val}</span>;
        },
      },
      {
        title: '排序值',
        dataIndex: 'sort',
        width: 100,
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        width: 100,
      },
      {
        title: '访问路由',
        dataIndex: 'router',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        width: 80,
        render: (val) => {
          if (val) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '创建时间',
        width: 150,
        dataIndex: 'created_at',
        render: (val) => <span>{formatDate(val, 'YYYY-MM-DD')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '系统管理' }, { title: '菜单管理', href: '/system/menu' }];

    // console.log(' ----- ===== == treeData ', treeData);

    return (
      <PageHeaderLayout title="菜单管理" breadcrumbList={breadcrumbList}>
        <Layout>
          <Layout.Sider
            width={180}
            style={{
              background: '#fff',
              borderRight: '1px solid lightGray',
              padding: 15,
              overflow: 'auto',
            }}
          >
            <Tree
              expandedKeys={expandedKeys}
              onSelect={(keys) => {
                this.setState({
                  treeSelectedKeys: keys,
                });

                const {
                  menu: { search },
                } = this.props;

                const item = {
                  parentID: undefined,
                };

                if (keys.length > 0) {
                  [item.parentID] = keys;
                }

                this.dispatch({
                  type: 'menu/fetch',
                  search: { ...search, ...item },
                  pagination: {},
                });
              }}
              onExpand={(keys) => {
                this.dispatch({
                  type: 'menu/saveExpandedKeys',
                  payload: keys,
                });
              }}
              // fieldNames={{title: "name", key: "id", children: "children"}}
              treeData={treeData}
              // loadData={this.handleTreeLoad}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </Layout.Sider>
          <Layout.Content>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                <div className={styles.tableListOperator}>
                  {showPButtons(
                    selectedRows,
                    this.onAddClick,
                    this.onItemEditClick,
                    this.onItemDelClick,
                    this.onItemEnableClick,
                    this.onItemDisableClick
                  )}
                </div>
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
            </Card>
          </Layout.Content>
        </Layout>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}
export default MenuList;

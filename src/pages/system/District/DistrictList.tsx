import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Card,
  Input,
  Button,
  Cascader,
  Modal,
  Badge,
  Space,
  Tag,
  Select,
} from 'antd';
import type { ColumnsState, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import qs from 'qs';
import { history } from 'umi';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { showPButtons } from '@/utils/uiutil';
import PButton from '@/components/PermButton';

import { formatDate } from '@/utils/datetime';
import { SysDistrctItem } from '@/scheme/sysdistrict.sch';
import DistrictCascader from '@/components/cascader/DistrictCascader';

import { makeupSortKey } from '@/utils/urlutil';

import DistrictCard from './DistrictCard';
import DistrictDetail from './DistrictDetail';
import DistrictDrawerForm from './DistrictDrawerForm';

import styles from './DistrictList.less';

@connect((state) => ({
  loading: state.loading.models.sysdistrict,
  sysdistrict: state.sysdistrict,
}))
class DistrictList extends PureComponent {
  formRef = React.createRef();
  searchFormRef = React.createRef();
  actionRef = React.createRef();

  //
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      columnsStateMap: {
        name_en: { order: 2 },
        initials: { order: 3 },
        sname: { show: true, order: 4 },
        sname_en: { order: 5 },
        abbr: { order: 6 },
        pinyin: { order: 7 },
        merge_name: { show: false, order: 8 },
        merge_sname: { show: false, order: 9 },
        suffix: { order: 10 },
        tree_id: { show: true, order: 11 },
        tree_level: { order: 12 },
        tree_left: { order: 13 },
        tree_right: { order: 14 },
        is_leaf: { order: 15 },
        zip_code: { order: 16 },
        area_code: { order: 17 },
        is_active: { order: 18 },
        is_real: { order: 19 },
        is_hot: { order: 20 },
        is_direct: { order: 21 },
        sort: { order: 22 },
        extra: { order: 23 },
      },
      countries: [],
      provinces: [],
      cities: [],
      pid: null,
    };
  }

  componentDidMount() {
    const { location } = this.props;

    // console.log(' -- --- == == = --- location: ', location);

    this.refetch({ pagination: { pageSize: 10, current: 1 } });

    const { dispatch } = this.props;

    dispatch({
      type: 'sysdistrict/fetchAllDistricts',
      params: { pid: '', is_real: true },
      callback: (res) => {
        this.setState({
          countries: res,
        });
      },
    });
  }

  onItemDisableClick = (item) => {
    this.dispatch({
      type: 'sysdistrict/changeStatus',
      payload: { id: item.id, is_active: false },
    });
  };

  onItemEnableClick = (item) => {
    this.dispatch({
      type: 'sysdistrict/changeStatus',
      payload: { id: item.id, is_active: true },
    });
  };

  onItemEditClick = (item) => {
    this.dispatch({
      type: 'sysdistrict/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'sysdistrict/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onItemDelClick = (item) => {
    Modal.confirm({
      title: `确定删除【行政区域：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.id),
    });
  };

  onDelOKClick(id) {
    this.dispatch({
      type: 'sysdistrict/del',
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
    newSelectedRows: SysDistrctItem[],
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

  onMainTableChange = (pagination, filter, sorter) => {
    const { pid } = this.state;
    let search = { pid };

    let nsort = makeupSortKey(sorter);

    console.log(' -------- ===== pid ', pid);

    if (this.searchFormRef.current) {
      let params = this.searchFormRef.current.getFieldsValue(true);
      search = { pid, ...params };
    }
    console.log(' -------- ===== search ', search);
    if (!pid) {
      delete search.pid;
    }
    this.refetch({ search, pagination });
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
    console.log(' ---- --- == === data ', data);
    const { dispatch } = this.props;

    dispatch({
      type: 'sysdistrict/submit',
      payload: data,
      callback: (success) => {
        return { tree_id__order: 'desc', tree_left__order: 'asc' };
      },
    });

    this.clearSelectRows();
  };

  onDetailDrawerClose = () => {
    console.log(' ----- - ==== = -- cancel');

    this.dispatch({
      type: 'sysdistrict/changeDetailDrawerOpen',
      payload: false,
    });
  };

  onDataFormClose = () => {
    console.log(' ------ = === - - cancel');

    this.dispatch({
      type: 'sysdistrict/changeFormDrawerOpen',
      payload: false,
    });
  };

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  refetch = ({ search = {}, pagination = {} } = {}) => {
    const { location } = this.props;

    // console.log(' ---- ----- ===== 9999 == location ', location);
    let params = qs.parse(location.search, { ignoreQueryPrefix: true });
    // console.log(' --------- ===== 9999 == params ', params);

    this.dispatch({
      type: 'sysdistrict/fetch',
      search: { ...params, ...search },
      pagination,
    });
  };

  parentFieldChanged = (values: string[]) => {
    // console.log(" -- -- -- ===== ---- values ", values);
  };

  onDistrictChange = (value: string[], selectedOptions: []) => {
    console.log(' ----- ====== ===== value ', value);
    console.log(' ----- ====== ===== selectedOptions ', selectedOptions);
  };

  onCountrySelectChange = (value, option: SysDistrctItem) => {
    console.log(' ----- ====== ===== country ', value);
    console.log(' ----- ====== =====  country option: ', option);

    const { dispatch } = this.props;

    dispatch({
      type: 'sysdistrict/fetchAllDistricts',
      params: { pid: value, is_real: true },
      callback: (res) => {
        this.setState({
          provinces: res,
          pid: value,
        });
      },
    });
  };

  onProvinceSelectChange = (value, option: SysDistrctItem) => {
    console.log(' ----- ====== ===== province ', value);
    console.log(' ----- ====== =====  province option: ', option);

    const { dispatch } = this.props;

    dispatch({
      type: 'sysdistrict/fetchAllDistricts',
      params: { pid: value, is_real: true },
      callback: (res) => {
        this.setState({
          cities: res,
          pid: value,
        });
      },
    });
  };

  onCitySelectChange = (value, option: SysDistrctItem) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'sysdistrict/fetchAllDistricts',
      params: { pid: value, is_real: true },
      callback: (res) => {
        console.log(' ------- ======= res ', res);
        this.setState({
          pid: value,
        });
      },
    });
  };

  onClickShowDetail = (item) => {
    this.dispatch({
      type: 'sysdistrict/loadDetail',
      payload: {
        record: item,
      },
    });
  };

  renderItemDetail() {
    return (
      <DistrictDetail width={850} onClose={this.onDetailDrawerClose} onAddClick={this.onAddClick} />
    );
  }

  renderDrawerForm() {
    return <DistrictDrawerForm width={850} onSubmit={this.onDataFormSubmit} />;
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
      sysdistrict: {
        data: { list, pagination },
      },
    } = this.props;

    // console.log(' -- --- == == = --- list: ', list);
    // console.log(' -- --- == == = --- location: ', location);

    const { selectedRows, selectedRowKeys, columnsStateMap, countries, provinces, cities } =
      this.state;
    // console.log(' -- --- == == = --- countries: ', countries);
    // console.log(' -- --- == == = --- provinces: ', provinces);
    // console.log(' -- --- == == = --- cities: ', cities);

    const columns: ProColumns<SysDistrctItem>[] = [
      {
        title: '父级',
        dataIndex: 'pid',
        hideInTable: true,
        renderFormItem: (schema, config, form) => {
          // console.log(' ---- ======== 0000000 == schema= ', schema);
          // console.log(' ---- ======== 0000000 == config= ', config);

          if (config.type === 'form') {
            return null;
          }

          const rest = {
            value: form.getFieldValue(`${schema.dataIndex}`),
            onChange: (value) => {
              // console.log(' ---- ======== 0000000 === ', value);
              const newValues = {};
              newValues[`${schema.dataIndex}`] = value;
              form.setFieldsValue(newValues);
            },
          };
          return (
            <Space wrap {...rest}>
              <Select
                style={{ width: 90 }}
                onChange={this.onCountrySelectChange}
                options={countries.map((oitem) => ({ label: oitem.name, value: oitem.id }))}
              />
              <Select
                style={{ width: 90 }}
                onChange={this.onProvinceSelectChange}
                options={provinces.map((oitem) => ({ label: oitem.name, value: oitem.id }))}
              />
              <Select
                onChange={this.onCitySelectChange}
                style={{ width: 90 }}
                options={cities.map((oitem) => ({ label: oitem.name, value: oitem.id }))}
              />
            </Space>
          );
          // return <DistrictCascader onChange={this.onDistrictChange} />
        },
      },

      {
        title: '名称',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '名称[英语]',
        dataIndex: 'name_en',
      },
      {
        title: '简码',
        dataIndex: 'initials',
      },
      {
        title: '短名称',
        dataIndex: 'sname',
      },
      {
        title: '短名称[英语]',
        dataIndex: 'sname_en',
      },
      {
        title: '简称',
        dataIndex: 'abbr',
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
        title: '行政后缀',
        dataIndex: 'suffix',
        hideInSearch: true,
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
        title: '树ID',
        dataIndex: 'tree_id',
        valueType: 'digit',
        sorter: { compare: (a, b) => a.tree_id - b.tree_id, multiple: 1 },
      },
      {
        title: '树层级',
        dataIndex: 'tree_level',
        valueType: 'digit',
        sorter: { compare: (a, b) => a.tree_level - b.tree_level, multiple: 2 },
      },
      {
        title: '树左值',
        dataIndex: 'tree_left',
        valueType: 'digit',
      },
      {
        title: '树右值',
        dataIndex: 'tree_right',
        valueType: 'digit',
      },
      {
        title: '是否真实区',
        dataIndex: 'is_real',
        valueType: 'select',
        valueEnum: {
          true: { text: '是', status: 'Default' },
          false: { text: '否', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">真</Tag>;
          }
          return <Tag color="#f50">虚</Tag>;
        },
      },
      {
        title: '是否热门',
        dataIndex: 'is_hot',
        valueType: 'select',
        valueEnum: {
          true: { text: '是', status: 'Default' },
          false: { text: '否', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">是</Tag>;
          }
          return <Tag color="#f50">否</Tag>;
        },
      },
      {
        title: '是否直辖',
        dataIndex: 'is_direct',
        valueType: 'select',
        valueEnum: {
          true: { text: '是', status: 'Default' },
          false: { text: '否', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">是</Tag>;
          }
          return <Tag color="#f50">否</Tag>;
        },
      },
      {
        title: '是否叶子',
        dataIndex: 'is_leaf',
        valueType: 'select',
        valueEnum: {
          true: { text: '是', status: 'Default' },
          false: { text: '否', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">是</Tag>;
          }
          return <Tag color="#f50">否</Tag>;
        },
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        valueType: 'select',
        valueEnum: {
          true: { text: '有效', status: 'Default' },
          false: { text: '失效', status: 'Error' },
        },
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
        width: '180px',
        ellipsis: true,
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

    const breadcrumbList = [{ title: '系统管理' }, { title: '行政区域', href: '/system/district' }];

    return (
      <PageHeaderLayout title="行政区域" breadcrumbList={breadcrumbList}>
        <Card size="small" bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderSearchForm()}</div> */}
            <div>
              <ProTable<SysDistrctItem>
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
                columnsState={{
                  persistenceType: 'localStorage',
                  // persistenceKey: `columns-state-${location.pathname}`,
                  value: columnsStateMap,
                  onChange: (map: Record<string, ColumnsState>) => {
                    console.log(' ------ ====== map ', map);
                    this.setState({
                      columnsStateMap: map,
                    });
                  },
                }}
                // search={false}
                pagination={paginationProps}
                request={(params, sort, filter) => {
                  console.log(' ---- ==== ====  sort =', sort);
                  console.log(' ---- ==== ==== =  params params ', params);
                  console.log(' ---- ==== ==== =');
                  const nparams = params;
                  const { pid } = this.state;
                  if (pid) {
                    nparams.pid = pid;
                  }
                  console.log(' ---- ==== ==== =  params param 111 ', nparams);

                  let nsort = makeupSortKey(sort);
                  this.refetch({
                    search: { ...nparams, ...nsort },
                    pagination: { current: params.current, pageSize: params.pageSize },
                  });
                  this.clearSelectRows();
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

export default DistrictList;

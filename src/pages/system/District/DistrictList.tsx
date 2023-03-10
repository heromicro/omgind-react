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

import { formatDate } from '@/utils/datetime';
import { SysDistrctItem } from '@/scheme/sysdistrict';
import DistrictCascader from '@/components/DistrictCascader';

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
        name: { order: 0 },
        name_en: { order: 1 },
        initials: { order: 2 },
        sname: { show: true, order: 3 },
        sname_en: { order: 4 },
        abbr: { order: 5 },
        pinyin: { order: 6 },
        merge_name: { show: false, order: 7 },
        merge_sname: { show: false, order: 8 },
        suffix: { order: 9 },
        tree_id: { show: true, order: 10 },
        tree_level: { order: 11 },
        tree_left: { order: 12 },
        tree_right: { order: 13 },
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
      title: `????????????????????????????????????${item.name}??????`,
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
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

    if (this.searchFormRef.current) {
      let params = this.searchFormRef.current.getFieldsValue(true);
      search = { pid, ...params };
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
    console.log(' ---- --- == === data ', data);
    const { dispatch } = this.props;

    dispatch({
      type: 'sysdistrict/submit',
      payload: data,
      callback: (success, burden) => {
        if (success) {
          const { location } = this.props;
          history.push({
            pathname: location.pathname,
            search: `tree_id__order=desc&after=${burden.id}`,
          });
          this.refetch();
        }
      },
    });

    this.clearSelectRows();
  };

  onDetailDrawerClose = () => {
    console.log(' ------ ===== -- cancel');

    this.dispatch({
      type: 'sysdistrict/changeDetailDrawerOpen',
      payload: false,
    });
  };

  onDataFormClose = () => {
    console.log(' ------ ===== -- cancel');

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
    // console.log(" ------ ===== ---- values ", values);
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

  renderDataDrawerForm() {
    return (
      // <DistrictDrawerForm width={850} onClose={this.onDataFormClose} onSubmit={this.onDataFormSubmit} />
      <DistrictDrawerForm width={850} onSubmit={this.onDataFormSubmit} />
    );
  }

  renderDataModalForm() {
    return <DistrictCard onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    return (
      <Form ref={this.formRef} onFinish={this.onSearchFormSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="queryValue">
              <Input placeholder="??????????????????????????????" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden', paddingTop: 4 }}>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                ??????
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
        title: '??????',
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
        title: '??????',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '??????[??????]',
        dataIndex: 'name_en',
      },
      {
        title: '??????',
        dataIndex: 'initials',
      },
      {
        title: '?????????',
        dataIndex: 'sname',
      },
      {
        title: '?????????[??????]',
        dataIndex: 'sname_en',
      },
      {
        title: '??????',
        dataIndex: 'abbr',
      },
      {
        title: '??????',
        dataIndex: 'pinyin',
      },
      {
        title: '????????????',
        dataIndex: 'merge_name',
      },
      {
        title: '????????????',
        dataIndex: 'merge_sname',
      },
      {
        title: '????????????',
        dataIndex: 'suffix',
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'zip_code',
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'area_code',
        hideInSearch: true,
      },
      {
        title: '???ID',
        dataIndex: 'tree_id',
        valueType: 'digit',
        sorter: { compare: (a, b) => a.tree_id - b.tree_id, multiple: 1 },
      },
      {
        title: '?????????',
        dataIndex: 'tree_level',
        valueType: 'digit',
        sorter: { compare: (a, b) => a.tree_level - b.tree_level, multiple: 2 },
      },
      {
        title: '?????????',
        dataIndex: 'tree_left',
        valueType: 'digit',
      },
      {
        title: '?????????',
        dataIndex: 'tree_right',
        valueType: 'digit',
      },
      {
        title: '???????????????',
        dataIndex: 'is_real',
        valueType: 'select',
        valueEnum: {
          true: { text: '???', status: 'Default' },
          false: { text: '???', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">???</Tag>;
          }
          return <Tag color="#f50">???</Tag>;
        },
      },
      {
        title: '????????????',
        dataIndex: 'is_hot',
        valueType: 'select',
        valueEnum: {
          true: { text: '???', status: 'Default' },
          false: { text: '???', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">???</Tag>;
          }
          return <Tag color="#f50">???</Tag>;
        },
      },
      {
        title: '????????????',
        dataIndex: 'is_direct',
        valueType: 'select',
        valueEnum: {
          true: { text: '???', status: 'Default' },
          false: { text: '???', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">???</Tag>;
          }
          return <Tag color="#f50">???</Tag>;
        },
      },
      {
        title: '????????????',
        dataIndex: 'is_leaf',
        valueType: 'select',
        valueEnum: {
          true: { text: '???', status: 'Default' },
          false: { text: '???', status: 'Default' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">???</Tag>;
          }
          return <Tag color="#f50">???</Tag>;
        },
      },
      {
        title: '??????',
        dataIndex: 'is_active',
        valueType: 'select',
        valueEnum: {
          true: { text: '??????', status: 'Default' },
          false: { text: '??????', status: 'Error' },
        },
        render: (val) => {
          if (val) {
            return <Tag color="#87d068">??????</Tag>;
          }
          return <Tag color="#f50">??????</Tag>;
        },
      },
      {
        title: '??????',
        dataIndex: 'sort',
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'extra',
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'option',
        hideInSearch: true,
        fixed: 'right',
        width: '60px',
        render: (val, record, row) => {
          return (
            <a
              onClick={() => {
                this.onClickShowDetail(record);
              }}
            >
              ??????
            </a>
          );
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <span>???{total}???</span>,
      ...pagination,
    };

    const breadcrumbList = [{ title: '????????????' }, { title: '????????????', href: '/system/district' }];

    return (
      <PageHeaderLayout title="????????????" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderSearchForm()}</div> */}
            <div>
              <ProTable<ProColumns>
                actionRef={this.actionRef}
                formRef={this.searchFormRef}
                scroll={{ x: 'max-content' }}
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
                  // console.log(" ---- ==== ==== =");
                  // console.log(" ---- ==== ==== =  params params ", params);
                  // console.log(" ---- ==== ==== =");
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
        {this.renderDataDrawerForm()}
      </PageHeaderLayout>
    );
  }
}

export default DistrictList;

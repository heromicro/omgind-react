import React from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import {
  Form,
  Divider,
  Button,
  Switch,
  message,
  Drawer,
  Input,
  Space,
  Row,
  Col,
  InputNumber,
  Select,
  DatePicker,
} from 'antd';
import { SaveFilled } from '@ant-design/icons';

import dayjs from 'dayjs';

import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import DistrictCascader from '@/components/cascader/DistrictCascader';
import DeptCascader from '@/components/cascader/DeptCascader';

import OrganSelector from '@/components/selectors/OrganSelector';

import DictSelector from '@/components/selectors/DictSelector';

import { collectionDistrictIDs } from '@/scheme/sysaddress';
import { formatDate } from '@/utils/datetime';

import styles from './staffDetail.less';

const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';

@connect((state) => ({
  cuser: state.global.user,
  orgstaff: state.orgstaff,
}))
class StaffDrawerForm extends React.PureComponent {
  formRef = React.createRef<ProFormInstance>();

  constructor(props) {
    super(props);

    this.state = {
      sorgId: '',
    };
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
  };

  onFinish = (data) => {
    console.log(' ======== === 0000 data : ', data);
    // console.log(' ======== === 0000 data : ', data.pids);
    // console.log(' ======== === this.formRef.current : ', this.formRef.current);
    let formData = data;
    const { onSubmit } = this.props;
    if (formData.iden_addr_district_ids) {
      delete formData.iden_addr_district_ids;
    }
    if (formData.resi_addr_district_ids) {
      delete formData.resi_addr_district_ids;
    }

    console.log(' === = ==== == = 1111 formData : ', formData);

    onSubmit(formData);

    return true;
  };

  onIdenAddrDistrictChange = (value, selectedOptions) => {
    console.log(' ------ = === -- == === value ', value);
    console.log(' ----- - ==== -- ==== = selectedOptions ', selectedOptions);

    if (selectedOptions) {
      switch (selectedOptions.length) {
        case 4:
          this.formRef.current.setFieldsValue({
            iden_addr: { county_id: selectedOptions[3].id, county: selectedOptions[3].name },
          });

        /* falls through */
        case 3:
          this.formRef.current.setFieldsValue({
            iden_addr: { city_id: selectedOptions[2].id, city: selectedOptions[2].name },
          });

        /* falls through */
        case 2:
          this.formRef.current.setFieldsValue({
            iden_addr: { province_id: selectedOptions[1].id, province: selectedOptions[1].name },
          });

        /* falls through */
        case 1:
          this.formRef.current.setFieldsValue({
            iden_addr: { country_id: selectedOptions[0].id, country: selectedOptions[0].name },
          });

          break;
        default:
          break;
      }
    }
  };

  onResiAddrDistrictChange = (value, selectedOptions) => {
    // console.log(' ------ = === -- == === value ', value);
    // console.log(' - ----- ==== -- === == selectedOptions ', selectedOptions);

    if (selectedOptions) {
      switch (selectedOptions.length) {
        case 4:
          this.formRef.current.setFieldsValue({
            resi_addr: { county_id: selectedOptions[3].id, county: selectedOptions[3].name },
          });

        /* falls through */
        case 3:
          this.formRef.current.setFieldsValue({
            resi_addr: { city_id: selectedOptions[2].id, city: selectedOptions[2].name },
          });

        /* falls through */
        case 2:
          this.formRef.current.setFieldsValue({
            resi_addr: { province_id: selectedOptions[1].id, province: selectedOptions[1].name },
          });
        /* falls through */
        case 1:
          this.formRef.current.setFieldsValue({
            resi_addr: { country_id: selectedOptions[0].id, country: selectedOptions[0].name },
          });
          break;
        default:
          break;
      }
    }
  };

  onGenderSelectorChange = (value, options) => {
    console.log(' ------- ==  === ------ ', value);
    console.log(' ------- === oooo yyyy == ------ ', options);
    if (options.dict_id) {
      this.formRef.current.setFieldValue('gender_dict_id', options.dict_id);
    }
  };

  onEmployeStatSelectorChange = (value, options) => {
    console.log(' ------- ==  === ------ ', value);
    console.log(' ------- === ooo0 uuuu == ------ ', options);
    if (options.dict_id) {
      this.formRef.current.setFieldValue('empyst_dict_id', options.dict_id);
    }
  };

  onClose = (e) => {
    console.log(' ---- ====== ==== ', e);

    this.dispatch({
      type: 'orgstaff/changeFormDrawerOpen',
      payload: false,
    });
  };

  onOrganSelectorChange = (value, option) => {
    console.log(' ------ = = onOrganSelectorChange == -- == === value ', value);
    console.log(' ------ = = onOrganSelectorChange == -- == === option ', option);

    this.setState({
      sorgId: value,
    });
  };

  onDeptParentChange = (value, selectedOptions) => {
    if (value && value.length > 0) {
      this.formRef.current.setFieldValue('dept_id', value[value.length - 1]);
    } else {
      this.formRef.current.setFieldValue('dept_id', '');
    }
  };

  render() {
    const {
      onSubmit,
      orgstaff: { formTitle, formVisible, formDrawerOpen, formData, submitting, formType },
      ...restProps
    } = this.props;
    const { sorgId } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 23 },
      },
    };

    // console.log(' -- -- -- = ==== -- form data ', formData);
    // console.log(' -- -- -- = ==== -- form data ', formData);

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(formData) ? formTitle : `${formTitle}--${formData.name}`}
        open={formDrawerOpen}
        destroyOnClose
        onClose={this.onClose}
        maskClosable={false}
        footer={
          <Space className={styles.drawerFooter}>
            <Space style={{ textAlign: 'left' }}>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                关 闭
              </Button>
            </Space>
            <Space style={{ textAlign: 'right' }}>
              <PButton
                code="add"
                key="add"
                type="primary"
                icon={<SaveFilled />}
                onClick={() => this.formRef.current.submit()}
              >
                保存
              </PButton>
              <Button type="dashed" onClick={this.onClose}>
                取 消
              </Button>
            </Space>
          </Space>
        }
      >
        {formVisible && (
          <Form
            ref={this.formRef}
            {...formItemLayout}
            layout="vertical"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              ...formData,
              iden_addr_district_ids: collectionDistrictIDs(formData.iden_addr),
              resi_addr_district_ids: collectionDistrictIDs(formData.resi_addr),
              area_code: _.isEmpty(formData.area_code) ? '+86' : formData.area_code,
              is_active: _.isEmpty(formData.is_active) ? true : formData.is_active,
              sort: formData.sort ? formData.sort : 9999,
              birth_date: formData.birth_date ? dayjs(formData.birth_date, dateFormat) : null,
              entry_date: formData.entry_date ? dayjs(formData.entry_date, dateFormat) : null,
              regular_date: formData.regular_date ? dayjs(formData.regular_date, dateFormat) : null,
              resign_date: formData.resign_date ? dayjs(formData.resign_date, dateFormat) : null,
              dept_ids: formData.dept
                ? formData.dept.tree_path
                  ? formData.dept.tree_path.split('/')
                  : null
                : null,
            }}
          >
            <Divider orientation="left" plain>
              基本信息
            </Divider>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="姓名"
                  name="first_name"
                  rules={[
                    { max: 64, message: '最多 64 字符' },
                    { required: true, message: '姓名必填' },
                  ]}
                >
                  <Input
                    addonBefore={
                      <Form.Item
                        name="last_name"
                        noStyle
                        rules={[
                          { max: 64, message: '最多 64 字符' },
                          { required: true, message: '姓必填' },
                        ]}
                      >
                        <Input style={{ width: 120 }} bordered={false} placeholder="姓" />
                      </Form.Item>
                    }
                    placeholder="名"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="联系电话"
                  name="mobile"
                  rules={[{ max: 64, message: '最多 64 字符' }]}
                >
                  <Input
                    addonBefore={
                      <Form.Item
                        name="area_code"
                        noStyle
                        rules={[{ max: 8, message: '最多 8 字符' }]}
                      >
                        <Input style={{ width: 80 }} bordered={false} />
                      </Form.Item>
                    }
                    placeholder="请输入联系电话"
                    allowClear
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="性别"
                  name="gender"
                  rules={[{ required: true, message: '性别必填' }]}
                >
                  <DictSelector
                    dictKey="gender"
                    dictId={formData ? '-' : formData.gender_dict_id}
                    placeholder="选择性别"
                    onChange={this.onGenderSelectorChange}
                  />
                </Form.Item>
                <Form.Item name="gender_dict_id" style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="出生日期"
                  name="birth_date"
                  rules={[{ required: true, message: '出生日期必填' }]}
                >
                  <DatePicker
                    presets={[
                      { label: '五年前', value: dayjs().add(-5, 'y') },
                      { label: '十年前', value: dayjs().add(-10, 'y') },
                      { label: '十五年前', value: dayjs().add(-15, 'y') },
                      { label: '二十年前', value: dayjs().add(-20, 'y') },
                      { label: '二十五年前', value: dayjs().add(-25, 'y') },
                      { label: '三十年前', value: dayjs().add(-30, 'y') },
                      { label: '三十五年前', value: dayjs().add(-35, 'y') },
                      { label: '四十年前', value: dayjs().add(-40, 'y') },
                      { label: '四十五年前', value: dayjs().add(-45, 'y') },
                    ]}
                    style={{ width: '100%' }}
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="身份证号"
                  name="iden_no"
                  rules={[
                    { max: 20, message: '最多 20 字符' },
                    { required: true, message: '身份证号必填' },
                  ]}
                >
                  <Input placeholder="身份证号" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="身份证地址"
                  name="iden_addr_district_ids"
                  rules={[{ required: true, message: '身份证地址必填' }]}
                >
                  <DistrictCascader onChange={this.onIdenAddrDistrictChange} allowClear />
                </Form.Item>

                <Form.Item
                  label="国id"
                  name={['iden_addr', 'country_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="国" name={['iden_addr', 'country']} style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>

                <Form.Item
                  label="省/市id"
                  name={['iden_addr', 'province_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item
                  label="省/市"
                  name={['iden_addr', 'province']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>

                <Form.Item
                  label="市/区id"
                  name={['iden_addr', 'city_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="市/区" name={['iden_addr', 'city']} style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>

                <Form.Item
                  label="县/区id"
                  name={['iden_addr', 'county_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="县/区" name={['iden_addr', 'county']} style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="身份证详细地址"
                  name={['iden_addr', 'daddr']}
                  rules={[{ max: 256, message: '最多 256 字符' }]}
                >
                  <Input.TextArea rows={2} placeholder="请输入身份证详细地址" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="现居地址"
                  name="resi_addr_district_ids"
                  rules={[{ required: true, message: '现居地址必填' }]}
                >
                  <DistrictCascader onChange={this.onResiAddrDistrictChange} allowClear />
                </Form.Item>

                <Form.Item
                  label="国id"
                  name={['resi_addr', 'country_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="国" name={['resi_addr', 'country']} style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>

                <Form.Item
                  label="省/市id"
                  name={['resi_addr', 'province_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item
                  label="省/市"
                  name={['resi_addr', 'province']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>

                <Form.Item
                  label="市/区id"
                  name={['resi_addr', 'city_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="市/区" name={['resi_addr', 'city']} style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>

                <Form.Item
                  label="县/区id"
                  name={['resi_addr', 'county_id']}
                  style={{ display: 'none' }}
                >
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="县/区" name={['resi_addr', 'county']} style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="现居详细地址"
                  name={['resi_addr', 'daddr']}
                  rules={[{ max: 256, message: '最多 256 字符' }]}
                >
                  <Input.TextArea rows={2} placeholder="现居详细地址" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="排序值"
                  name="sort"
                  rules={[{ type: 'number', required: true, message: '请输入排序' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="状态" name="is_active" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left" plain>
              职场信息
            </Divider>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="所属企业"
                  name="org_id"
                  rules={[{ required: true, message: '所属企业必填' }]}
                >
                  <OrganSelector
                    mode="combobox"
                    onChange={this.onOrganSelectorChange}
                    // disabled={formType === 'E'}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="在职状态"
                  name="empy_stat"
                  rules={[{ required: true, message: '在职状态必填' }]}
                >
                  <DictSelector
                    dictKey="employemnt_stat"
                    dictId={formData ? '-' : formData.empyst_dict_id}
                    placeholder="请选择在职状态"
                    onChange={this.onEmployeStatSelectorChange}
                  />
                </Form.Item>
                <Form.Item name="empyst_dict_id" style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="所属部门"
                  name="dept_ids"
                  rules={[{ required: true, message: '所属部门必填' }]}
                >
                  <DeptCascader
                    onChange={this.onDeptParentChange}
                    orgId={formType === 'E' ? (formData.org_id ? formData.org_id : null) : sorgId}
                    disabled={
                      (formType === 'E' && !formData.org_id) || (formType === 'A' && !sorgId)
                    }
                    allowClear
                  />
                </Form.Item>
                <Form.Item label="部门" name="dept_id" style={{ display: 'none' }}>
                  <Input type="hidden" allowClear />
                </Form.Item>
                <Form.Item label="职级" name="rank" rules={[{ max: 16, message: '最多 16 字符' }]}>
                  <Input placeholder="请输入职级" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="工号"
                  name="worker_no"
                  rules={[{ max: 16, message: '最多 16 字符' }]}
                >
                  <Input placeholder="请输入工号" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="工位编号"
                  name="cubicle"
                  rules={[{ max: 32, message: '最多 32 字符' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  label="入职日期"
                  name="entry_date"
                  rules={[{ required: true, message: '入职日期必填' }]}
                >
                  <DatePicker style={{ width: '100%' }} format={dateFormat} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="转正日期" name="regular_date">
                  <DatePicker
                    presets={[
                      { label: '一月后', value: dayjs().add(1, 'M') },
                      { label: '两月后', value: dayjs().add(2, 'M') },
                      { label: '三月后', value: dayjs().add(3, 'M') },
                    ]}
                    style={{ width: '100%' }}
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item label="离职日期" name="resign_date">
                  <DatePicker style={{ width: '100%' }} format={dateFormat} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    );
  }
}

export default StaffDrawerForm;

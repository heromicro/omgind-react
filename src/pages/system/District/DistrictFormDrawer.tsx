import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Drawer, Switch } from 'antd';
import {
  DrawerForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { SysDistrctItem } from '@/scheme/sysdistrict';

// import FormRender, { connectForm } from 'form-render';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictFormDrawer extends PureComponent {
  formRef = React.createRef();

  onOpenChange = (visible: boolean) => {
    console.log(' ----- === visible :', visible);
    const { dispatch } = this.props;
    if (!visible) {
      dispatch({
        type: 'sysdistrict/changeModalFormVisible',
        payload: false,
      });
    }
  };

  onOKClick = (formData) => {
    const { onSubmit } = this.props;
    console.log(' ----- === formData :', formData);

    // this.formRef.current
    //   .validateFields()
    //   .then((values) => {
    //     console.log(' ----- === values :', values);
    //     const formData = { ...values };
    //     onSubmit(formData);
    //   })
    //   .catch((err) => {
    //     console.log(' ----- === err :', err.values);
    //     console.log(' ----- === err :', err.errorFields);
    //     console.log(' ----- === err :', err.outOfDate);
    //   });
  };

  onFinishFailed({ values, errorFields, outOfDate }) {
    console.log(' ----- === values  :', values);
    console.log(' ----- === errorFields :', errorFields);
    console.log(' ----- === outOfDate :', outOfDate);
    // this.formRef.current.scrollToField(errorFields[0].name);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { onCancel, sysdistrict } = this.props;
    const { formTitle, formVisible, formModalVisible, formData, submitting } = sysdistrict;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    console.log(' ----- === formData == == ', formData);

    return (
      <DrawerForm<SysDistrctItem>
        title={formTitle}
        width={800}
        ref={this.formRef}
        open={formModalVisible}
        onOpenChange={this.onOpenChange}
        autoFocusFirstInput
        confirmLoading={submitting}
        drawerProps={{
          destroyOnClose: true,
        }}
        initialValues={formData}
        onFinish={this.onOKClick}
        onFinishFailed={this.onFinishFailed}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="名称"
            tooltip="最长为 128 字符"
            placeholder="请输入名称"
            required
          />

          <ProFormSelect
            width="md"
            name="pid"
            label="上级"
            tooltip="若顶级勿选"
            placeholder="请选择上级"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="sname"
            label="短名称"
            tooltip="最长为 64 字符"
            placeholder="请输入短名称"
          />
          <ProFormText
            width="md"
            name="abbr"
            label="简称"
            tooltip="最长为 64 字符,比如:广东 => 粤, 福建 => 闽, New York => NY"
            placeholder="请输入简称"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="merge_name"
            label="行政名称"
            tooltip="最长为 256 字符"
            placeholder="请输入行政名称"
          />
          <ProFormText
            width="md"
            name="merge_sname"
            label="行政短名称"
            tooltip="最长为 256 字符"
            placeholder="请输入行政短名称"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            width="md"
            name="suffix"
            label="行政后缀"
            tooltip="最长为 16 字符, 比如:省/市/区/盟/旗"
            placeholder="请输入行政短后缀"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            width="md"
            name="pinyin"
            label="拼音"
            tooltip="最长为 128 字符"
            placeholder="请输入拼音"
          />
          <ProFormText
            width="md"
            name="initials"
            label="简拼"
            tooltip="最长为 128 字符"
            placeholder="请输入简拼"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="area_code"
            label="区号"
            tooltip="最长为 8 字符"
            placeholder="请输入区号"
          />
          <ProFormText
            width="md"
            name="zip_code"
            label="邮码"
            tooltip="最长为 8 字符"
            placeholder="请输入邮码"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch
            width="md"
            name="is_active"
            label="是否有效"
            checkedChildren="有效"
            unCheckedChildren="失效"
            fieldProps={{ defaultChecked: true }}
          />

          <ProFormSwitch
            width="md"
            name="is_main"
            label="是否主要"
            checkedChildren="主要"
            unCheckedChildren="非主要"
            fieldProps={{ defaultChecked: false }}
          />

          <ProFormSwitch
            width="md"
            name="is_real"
            label="是否真实区域"
            checkedChildren="真实"
            unCheckedChildren="虚拟"
            fieldProps={{ defaultChecked: true }}
          />

          <ProFormSwitch
            width="md"
            name="is_hot"
            label="是否热点区域"
            checkedChildren="热点"
            unCheckedChildren="非热点"
            fieldProps={{ defaultChecked: false }}
          />
          <ProFormSwitch
            width="md"
            name="is_direct"
            label="是否直辖"
            checkedChildren="直辖"
            unCheckedChildren="不直辖"
            fieldProps={{ defaultChecked: false }}
          />
        </ProForm.Group>
      </DrawerForm>
    );
  }
}

// export default connectForm(DistrictFormDrawer);
export default DistrictFormDrawer;

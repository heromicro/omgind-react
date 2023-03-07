import React from 'react';
import {
  DrawerForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { Button, Form, message } from 'antd';

import { connect } from 'dva';

import { SysDistrctItem } from '@/scheme/sysdistrict';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictDrawerForm extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onFinish(formData) {
    console.log(' ======== === formData : ', formData);

    return true;
  }

  onClose = (e) => {
    
    console.log(" ---- ====== ==== ", e)

    this.dispatch({
      type: 'sysdistrict/changeFormDrawerOpen',
      payload: false,
    });
  };

  render() {
    const {
      sysdistrict: { formTitle, formVisible, formDrawerOpen, formData, submitting },
    } = this.props;
    
    console.log(" ---- ====== ==== formDrawerOpen ", formDrawerOpen)

    return (
      <DrawerForm<SysDistrctItem>
        title={formTitle}
        ref={this.formRef}
        open={formDrawerOpen}
        autoFocusFirstInput
        drawerProps={{
          destroyOnClose: true,
          onClose: this.onClose,
        }}
        onFinish={this.onFinish}
      >
        <ProForm.Group>
            dd
        </ProForm.Group>
      </DrawerForm>
    );
  }
}

export default DistrictDrawerForm;

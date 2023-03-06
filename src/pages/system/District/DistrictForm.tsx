import exp from 'constants';
import React from 'react';
import { connect } from 'dva';

import { Form, Input, Switch } from 'antd';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictForm extends React.PureComponent {
  formRef = React.createRef();

  // constructor(props) {
  //     super(props);
  // }

  onFinish = (formData) => {
    const { onSubmit } = this.props;
    console.log(' ----- === formData :', formData);
    onSubmit(formData);
    return false;
  };

  render() {
    const { sysdistrict } = this.props;
    const { formData, submitting } = sysdistrict;

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

    return (
      <Form
        ref={this.formRef}
        disabled={!submitting}
        initialValues={{
          ...formData,
          is_active: formData.statuis_actives === undefined ? true : formData.is_active,
        }}
      >
        <Form.Item
          {...formItemLayout}
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="请输入编号" />
        </Form.Item>

        <Form.Item {...formItemLayout} label="状态" name="is_active">
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    );
  }
}

export default DistrictForm;

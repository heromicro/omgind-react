import React, { PureComponent } from 'react';

import { Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

export const EditableFormRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
export class EditableCell extends PureComponent {
  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  renderFormItem = (dataIndex, title, record) => {
    if (dataIndex === 'method') {
      return (
        <FormItem
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `请选择${title}`,
            },
          ]}
        >
          {this.form.getFieldDecorator(dataIndex, {
            rules: [],
            initialValue: record[dataIndex],
          })(
            <Select
              style={{ width: '100%' }}
              onBlur={() => {
                this.save();
              }}
            >
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="PATCH">PATCH</Select.Option>
              <Select.Option value="HEAD">HEAD</Select.Option>
              <Select.Option value="OPTIONS">OPTIONS</Select.Option>
            </Select>
          )}
        </FormItem>
      );
    }

    return (
      <FormItem style={{ margin: 0 }}>
        {this.form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `请输入${title}`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Input
            onBlur={() => {
              this.save();
            }}
            style={{ width: '100%' }}
          />
        )}
      </FormItem>
    );
  };

  render() {
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return this.renderFormItem(dataIndex, title, record);
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

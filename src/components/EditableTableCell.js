import React, { createContext, useContext } from 'react';
import { Form, Input, Select } from 'antd';

const EditableContext = createContext(null);
export function EditableFormRow({ index, ...props }) {
  const [form] = Form.useForm();
  return <Form form={form} component={false}>
    <EditableContext.Provider value={form}><tr {...props} /></EditableContext.Provider>
  </Form>;
}
export function EditableCell({ editable, dataIndex, title, record, index, handleSave, children, ...props }) {
  const form = useContext(EditableContext);
  const save = async () => {
    try { handleSave({ ...record, ...await form.validateFields() }); }
    catch { /* Validation messages are displayed by Form.Item. */ }
  };
  return <td {...props}>{editable ? <Form.Item
    name={dataIndex} initialValue={record[dataIndex]} style={{ margin: 0 }}
    rules={[{ required: true, message: `请输入${title}` }]}
  >{dataIndex === 'method'
    ? <Select onChange={save} style={{ minWidth: 100 }} options={['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map(value => ({ value, label: value }))} />
    : <Input onBlur={save} onPressEnter={save} />}
  </Form.Item> : children}</td>;
}

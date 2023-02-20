import React from 'react';
import { Form, Input, InputNumber } from 'antd';

class DemoEditableCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { editing, dataIndex, title, inputType, record, index, children, ...restProps } =
      this.props;

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    // console.log(" - ========= === = dataIndex ", dataIndex)
    // console.log(" - ========= === = record ", record)

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            initialValue
            rules={[{ required: true, message: `Please Input ${title}!` }]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default DemoEditableCell;

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Button, Input, Radio, Row, Space, Col, Badge, Switch, Card, Drawer, Divider } from 'antd';

import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { checkActionPermission } from '@/utils/checkPermission';

@connect((state) => ({
  sysuser: state.sysuser,
  global: state.global,
}))
class UserDetail extends PureComponent {
  render() {
    const {
      sysuser,
      onClose,
      global: { menuPaths },
      ...restProps
    } = this.props;
    const { detailDrawerOpen, formData } = sysuser;

    let detailData = formData;
    // console.log(' ---====-- ', formData);

    console.log(' ---== ==-- ', JSON.stringify(detailData));

    return (
      <Drawer
        {...restProps}
        onClose={onClose}
        open={detailDrawerOpen}
        title={detailData.name}
        footer={
          <div style={{ textAlign: 'left' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              关闭
            </Button>
          </div>
        }
      >
        <ProDescriptions column={2} title="基本信息">
          <ProDescriptions.Item label="姓名" key="name">
            {`${detailData.last_name} ${detailData.first_name}`}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="登陆号" key="user_name">
            {detailData.user_name}
          </ProDescriptions.Item>
        </ProDescriptions>

        {/* TODO:: 角色列表 */}

        {/* TODO:: 组列表 */}

        <ProDescriptions column={1} title="其它">
          <ProDescriptions.Item label="状态">
            {detailData.is_active === true ? (
              <Badge status="success" text="启用" />
            ) : (
              <Badge status="error" text="停用" />
            )}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="备注">{detailData.memo}</ProDescriptions.Item>
        </ProDescriptions>
      </Drawer>
    );
  }
}

export default UserDetail;

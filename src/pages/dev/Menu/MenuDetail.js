import React, { PureComponent } from 'react';
import { connect } from 'dva';

import {
  Button,
  Input,
  Radio,
  Row,
  Space,
  Col,
  Badge,
  Switch,
  Card,
  Drawer,
  Divider,
  Tag,
  Tooltip,
} from 'antd';

import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import {
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

@connect((state) => ({
  menu: state.menu,
}))
class MenuDetail extends PureComponent {
  render() {
    const { menu, onClose, ...restProps } = this.props;
    const { drawerDetailopen, detailData } = menu;
    // let detailData = formData;
    console.log(' ---====-- ', detailData);

    console.log(' ---== ==-- ', JSON.stringify(detailData.actions));

    return (
      <Drawer
        {...restProps}
        onClose={onClose}
        open={drawerDetailopen}
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
          <ProDescriptions.Item label="名称" key="name">
            {detailData.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="图标" key="icon">
            {detailData.icon}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="路由" key="router">
            {detailData.router}
          </ProDescriptions.Item>
          {/* <ProDescriptions.Item label="资产数量" key="asset_amount">
            {detailData.asset_amount}
          </ProDescriptions.Item> */}

          <ProDescriptions.Item label="层级" key="level">
            {detailData.level}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="是否末级" key="is_leaf">
            {detailData.is_leaf ? '是' : '否'}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="打开新标签" key="open_blank">
            {detailData.open_blank === true ? (
              <Badge status="success" text="是" />
            ) : (
              <Badge status="error" text="否" />
            )}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="是否显示">
            {detailData.is_show ? (
              <Badge status="success" text="显示" />
            ) : (
              <Badge status="error" text="不显示" />
            )}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="状态" key="is_active">
            {detailData.is_active === true ? (
              <Badge status="success" text="启用" />
            ) : (
              <Badge status="error" text="停用" />
            )}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="备注" key="memo">
            {detailData.memo}
          </ProDescriptions.Item>
        </ProDescriptions>

        <Divider />

        <ProDescriptions column={4} title="动作">
          {detailData.actions &&
            detailData.actions.map((item) => (
              <>
                <ProDescriptions.Item span={1} label={item.name} key={item.code}>
                  <Tag color="green">{item.code}</Tag>
                </ProDescriptions.Item>
                <ProDescriptions.Item span={3} label="资源" key="resources" valueType="jsonCode">
                  {item.resources && JSON.stringify(item.resources)}
                </ProDescriptions.Item>
              </>
            ))}
        </ProDescriptions>
      </Drawer>
    );
  }
}

export default MenuDetail;

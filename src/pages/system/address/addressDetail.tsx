import React from 'react';
import { Button, Drawer, Space, Tag } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';

import * as lod from 'lodash';

import PButton from '@/components/PermButton';
import { concatenateDistricts } from '@/scheme/sysaddress.sch';

import styles from './addressDetail.less';

@connect((state) => ({
  sysaddress: state.sysaddress,
}))
class AddressDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount(): void {}

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onClickEdit = (item) => {
    console.log(' ---- ==== click edit eee ');

    this.dispatch({
      type: 'sysaddress/loadForm',
      payload: {
        type: 'E',
        id: item.id,
      },
    });
  };

  onOpenChange = (visible: boolean) => {
    console.log(' ----- === visible :', visible);
    const { dispatch } = this.props;
    if (!visible) {
      dispatch({
        type: 'sysaddress/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  render(): React.ReactNode {
    const { onClose, onAddClick, sysaddress, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = sysaddress;

    console.log(' ----- === detailData == == ', detailDrawerOpen);

    return (
      <Drawer
        {...restProps}
        title={lod.isEmpty(detailData) ? '' : `地址--${detailData.name}`}
        onClose={onClose}
        open={detailDrawerOpen}
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
        footer={
          <Space className={styles.drawerFooter}>
            <Space style={{ textAlign: 'left' }}>
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                关 闭
              </Button>
            </Space>
            <Space style={{ textAlign: 'right' }}>
              <PButton
                code="add"
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => onAddClick()}
              >
                新建
              </PButton>
              <PButton
                code="edit"
                type="primary"
                onClick={() => this.onClickEdit(detailData)}
                danger
                disabled={lod.isEmpty(detailData)}
              >
                编 辑
              </PButton>
              <Button type="ghost" onClick={onClose}>
                取 消
              </Button>
            </Space>
          </Space>
        }
      >
        {!lod.isEmpty(detailData) && (
          <div>
            <ProDescriptions column={2} title="基本信息">
              <ProDescriptions.Item label="联系人" key="name">
                {`${detailData.last_name} ${detailData.first_name} `}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="联系电话" key="mobile">
                {detailData.mobile}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="地址" key="mobile">
                {concatenateDistricts(detailData, { withDaddr: true })}
              </ProDescriptions.Item>

              <ProDescriptions.Item span={1} label="有效否" key="is_active">
                {detailData.is_active === true ? (
                  <span style={{ color: 'darkGreen' }}>
                    <Tag color="#87d068">有效</Tag>
                  </span>
                ) : (
                  <span style={{ color: 'red' }}>
                    <Tag color="#f50">失效</Tag>
                  </span>
                )}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={2} title="所有者">
              {/* <ProDescriptions.Item label="地址" key="mobile">
                {detailData.mobile}
              </ProDescriptions.Item> */}
            </ProDescriptions>
          </div>
        )}
      </Drawer>
    );
  }
}

export default AddressDetail;

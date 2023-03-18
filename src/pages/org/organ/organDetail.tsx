import React from 'react';
import { Button, Drawer, Space, Badge } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import { concatenateDistricts } from '@/scheme/sysaddress';

import styles from './organDetail.less';

@connect((state) => ({
  orgorgan: state.orgorgan,
}))
class OrganDetail extends React.PureComponent {
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
      type: 'orgorgan/loadForm',
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
        type: 'orgorgan/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  render(): React.ReactNode {
    const { onClose, onAddClick, orgorgan, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = orgorgan;

    console.log(' ----- === detailData == == ', detailData);

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(detailData) ? '' : `企业--${detailData.name}`}
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
                disabled={_.isEmpty(detailData)}
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
        {!_.isEmpty(detailData) && (
          <div>
            <ProDescriptions column={2} title="基本信息">
              <ProDescriptions.Item label="名称" key="name">
                {`${detailData.name} `}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="短名称" key="sname">
                {detailData.sname}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="执照号" key="iden_no">
                {detailData.iden_no}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="" key="blank1" />

              <ProDescriptions.Item label="总部地址" key="haddr">
                {detailData.haddr ? concatenateDistricts(detailData.haddr, {}) : ''}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={2} title="部门">
              {/* <ProDescriptions.Item label="地址" key="mobile">
                {detailData.mobile}
              </ProDescriptions.Item> */}
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

export default OrganDetail;

import React from 'react';
import { Button, Drawer, Space, Tooltip, Tag } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';

import * as lod from 'lodash';

import { SysAnnexItem } from '@/scheme/sysannex.sch';

import PButton from '@/components/PermButton';

import { isRootUser } from '@/utils/utils';

import styles from './annexDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  sysannex: state.sysannex,
}))
class AnnexDetail extends React.PureComponent {
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
      type: 'sysannex/loadForm',
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
        type: 'sysannex/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  render(): React.ReactNode {
    const { onClose, onAddClick, sysannex, cuser, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = sysannex;

    console.log(' ----- === detailData == == ', detailData);

    return (
      <Drawer
        {...restProps}
        title={lod.isEmpty(detailData) ? '' : `设备--${detailData.name}`}
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
                key="edit"
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
              <ProDescriptions.Item label="名称" key="name">
                {`${detailData.name} `}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="文件路径" key="file_path">
                {detailData.file_path}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="排序" key="sort">
                {detailData.sort}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="有效否" key="is_active">
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
          </div>
        )}
      </Drawer>
    );
  }
}

export default AnnexDetail;

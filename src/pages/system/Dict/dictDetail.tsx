import React from 'react';
import { Button, Drawer, Space, Tooltip, Tag } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';

import { isRootUser } from '@/utils/utils';

import styles from './dictDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  sysdict: state.sysdict,
}))
class AnnexDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount(): void {}

  renderItems(items) {
    console.log(' ------ ==== items ==== ', items);
    const teamTags = items.map((item) => {
      if (item.is_active) {
        return (
          <Space key={item.id}>
            <ProDescriptions.Item label="显示值" key="label">
              {item.label}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="显示值" key="value">
              {item.value}
            </ProDescriptions.Item>
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
          </Space>
        );
      }
      return (
        <Space key={item.id}>
          <ProDescriptions.Item label="显示值" key="label">
            {item.label}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="显示值" key="value">
            {item.value}
          </ProDescriptions.Item>
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
        </Space>
      );
    });
    return <div>{teamTags}</div>;
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onClickEdit = (item) => {
    console.log(' ---- ==== click edit eee ');

    this.dispatch({
      type: 'sysdict/loadForm',
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
        type: 'sysdict/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  render(): React.ReactNode {
    const { onClose, onAddClick, sysdict, cuser, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = sysdict;

    console.log(' ----- === detailData == == ', detailData);

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(detailData) ? '' : `设备--${detailData.name_cn}`}
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
              <ProDescriptions.Item label="名称(中)" key="name_cn">
                {`${detailData.name_cn} `}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="名称(英)" key="name_en">
                {`${detailData.name_en} `}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="索引" key="dict_key">
                {`${detailData.dict_key} `}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="值类型" key="val_tipe">
                {`${detailData.val_tipe} `}
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

              <ProDescriptions.Item label="备注" key="memo">
                {detailData.memo}
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={5} title="数据项" size="small">
              {detailData.items && this.renderItems(detailData.items)}
            </ProDescriptions>
            &nbsp;
          </div>
        )}
      </Drawer>
    );
  }
}

export default AnnexDetail;

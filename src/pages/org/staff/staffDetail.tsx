import React from 'react';
import { Button, Drawer, Space, Badge } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import { concatenateDistricts } from '@/scheme/sysaddress';
import { isRootUser } from '@/utils/utils';

import styles from './staffDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  orgstaff: state.orgstaff,
}))
class StaffDetail extends React.PureComponent {
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
      type: 'orgstaff/loadForm',
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
        type: 'orgstaff/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  render(): React.ReactNode {
    const { onClose, onAddClick, orgstaff, cuser, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = orgstaff;

    console.log(' ----- === detailData == == ', detailDrawerOpen);

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(detailData) ? '' : `地址--${detailData.name}`}
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
            <ProDescriptions column={2} title="个人信息">
              <ProDescriptions.Item label="姓名" key="name">
                {`${detailData.last_name} ${detailData.first_name}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="电话" key="mobile">
                {detailData.mobile}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="出生日期" key="birth_date">
                {detailData.birth_date}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="性别" key="gender">
                {detailData.gender}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="身份证号" key="iden_no">
                {detailData.iden_no}
              </ProDescriptions.Item>

              <ProDescriptions.Item span={1} label="有效否" key="is_active">
                {detailData.is_active === true ? (
                  <span style={{ color: 'darkGreen' }}>
                    <Badge status="success" />
                    有效
                  </span>
                ) : (
                  <span style={{ color: 'red' }}>
                    <Badge status="error" />
                    失效
                  </span>
                )}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="排序" key="sort">
                {detailData.sort}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="备注" key="memo">
                {detailData.memo}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={2} title="职场信息">
              <ProDescriptions.Item label="工号" key="worker_no">
                {detailData.worker_no}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="工位" key="cubicle">
                {detailData.cubicle}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="入职日期" key="entry_date">
                {detailData.entry_date}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="转正日期" key="regular_date">
                {detailData.regular_date}
              </ProDescriptions.Item>

              {detailData.resign_date ? (
                <ProDescriptions.Item label="离职日期" key="resign_date">
                  {detailData.resign_date}
                </ProDescriptions.Item>
              ) : null}
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={2} title="所属公司">
              <ProDescriptions.Item label="名称" key="org_name">
                {detailData.org.name}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="执照号" key="org_iden_no">
                {detailData.org.iden_no}
              </ProDescriptions.Item>
            </ProDescriptions>
          </div>
        )}
      </Drawer>
    );
  }
}

export default StaffDetail;
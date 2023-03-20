import React from 'react';
import { Button, Drawer, Space, Badge } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import * as _ from 'lodash';

import PButton from '@/components/PermButton';
import { concatenateDistricts } from '@/scheme/sysaddress';
import { isRootUser } from '@/utils/utils';

import styles from './departmentDetail.less';

@connect((state) => ({
  cuser: state.global.user,
  orgdepartment: state.orgdepartment,
}))
class DepartmentDetail extends React.PureComponent {
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
      type: 'orgdepartment/loadForm',
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
        type: 'orgdepartment/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  render(): React.ReactNode {
    const { onClose, onAddClick, orgdepartment, cuser, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = orgdepartment;

    console.log(' ----- === detailData == == ', detailDrawerOpen);

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(detailData) ? '' : `部门--${detailData.name}`}
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
                {detailData.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="助记码" key="code">
                {detailData.code}
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
            {isRootUser(cuser) ? (
              <>
                &nbsp;
                <ProDescriptions column={2} title="企业信息">
                  <ProDescriptions.Item label="地址" key="org_addr">
                    {/* {concatenateDistricts(detailData.org.addr, { reverse: false })} */}
                  </ProDescriptions.Item>
                </ProDescriptions>
              </>
            ) : null}
          </div>
        )}
      </Drawer>
    );
  }
}

export default DepartmentDetail;

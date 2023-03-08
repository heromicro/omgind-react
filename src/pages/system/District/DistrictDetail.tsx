import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Drawer, Space, Badge } from 'antd';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PlusOutlined } from '@ant-design/icons';

import * as _ from 'lodash';

import PButton from '@/components/PermButton';

import { SysDistrctItem } from '@/scheme/sysdistrict';

import styles from './DistrictDetail.less';

@connect((state) => ({
  sysdistrict: state.sysdistrict,
}))
class DistrictDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount(): void {}

  onClickEdit = (item) => {
    console.log(' ---- ==== click edit eee ');

    this.dispatch({
      type: 'sysdistrict/loadForm',
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
        type: 'sysdistrict/changeDetailDrawerOpen',
        payload: false,
      });
    }
  };

  onFinishFailed({ values, errorFields, outOfDate }) {
    console.log(' ----- === values  :', values);
    console.log(' ----- === errorFields :', errorFields);
    console.log(' ----- === outOfDate :', outOfDate);
  }

  dispatch = (action) => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { onClose, onAddClick, sysdistrict, ...restProps } = this.props;
    const { detailDrawerOpen, detailData } = sysdistrict;

    console.log(' ----- === detailData == == ', detailData);

    return (
      <Drawer
        {...restProps}
        title={_.isEmpty(detailData) ? '' : `行政区域--${detailData.name}`}
        onClose={onClose}
        open={detailDrawerOpen}
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
        // bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
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
              <ProDescriptions.Item label="上级" key="parent">
                {detailData.parent ? `${detailData.parent.name}` : ''}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="短名称" key="sname">
                {detailData.sname}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="简称" key="abbr">
                {detailData.abbr}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="行政名称" key="merge_name">
                {detailData.merge_name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="行政短名称" key="merge_sname">
                {detailData.merge_sname}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="行政后缀" key="suffix">
                {detailData.suffix}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="统计编号" key="st_code">
                {detailData.st_code}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={2} title="详细信息">
              <ProDescriptions.Item label="排序" key="sort">
                {detailData.sort}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="状态">
                {detailData.is_active ? (
                  <Badge status="success" text="启用" />
                ) : (
                  <Badge status="error" text="停用" />
                )}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="是否主要">
                {detailData.is_main ? (
                  <Badge status="success" text="主要" />
                ) : (
                  <Badge status="error" text="非主要" />
                )}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="是否真实区域">
                {detailData.is_real ? (
                  <Badge status="success" text="真实" />
                ) : (
                  <Badge status="error" text="非真实" />
                )}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="是否热点区域">
                {detailData.is_hot ? (
                  <Badge status="success" text="热点" />
                ) : (
                  <Badge status="error" text="非热点" />
                )}
              </ProDescriptions.Item>

              <ProDescriptions.Item label="是否直辖">
                {detailData.is_direct ? (
                  <Badge status="success" text="直辖" />
                ) : (
                  <Badge status="error" text="非直辖" />
                )}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={2} title="树形信息">
              <ProDescriptions.Item label="树id" key="tree_id">
                {detailData.tree_id}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="树左值" key="tree_left">
                {detailData.tree_left}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="树右值" key="tree_right">
                {detailData.tree_right}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="是否子叶" key="isLeaf">
                {detailData.isLeaf ? (
                  <Badge status="success" text="子叶" />
                ) : (
                  <Badge status="error" text="非子叶" />
                )}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            <ProDescriptions column={1} title="地理信息">
              <ProDescriptions.Item label="经纬度" key="longlat">
                {`${detailData.longitude}, ${detailData.latitude}`}
              </ProDescriptions.Item>
            </ProDescriptions>
            &nbsp;
            {/* 
            <ProDescriptions column={1} title="json">
              
              <ProDescriptions.Item label="all" key="json">
               
               { JSON.stringify(detailData) }

              </ProDescriptions.Item>
            </ProDescriptions> */}
          </div>
        )}
      </Drawer>
    );
  }
}

export default DistrictDetail;

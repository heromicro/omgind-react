import React from 'react';
import { Link } from 'umi';
import PageHeader from '@/components/PageHeader';
import styles from './PageHeaderLayout.less';

export default function ({ children, wrapperClassName, top, ...restProps }) {
  return (
    <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
      {top}
      <PageHeader {...restProps} linkElement={Link} />
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
}

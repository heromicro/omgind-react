import React from 'react';
import { Outlet } from '@umijs/max';
import { connect } from '@umijs/max';
import GlobalFooter from '@/components/GlobalFooter';
import CopyRight from '@/components/CopyRight';
import styles from './AuthenLayout.less';
import logo from '../assets/logo.svg';

@connect(state => ({
  global: state.global,
}))
class AuthenLayout extends React.PureComponent {
  render() {
    const {
      children,
      global: { title, copyRight },
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="" className={styles.logo} src={logo} />
            <span className={styles.title}>{title}</span>
          </div>
          <div className={styles.desc} />
        </div>
        <Outlet />
        <GlobalFooter className={styles.footer} copyright={<CopyRight title={copyRight} />} />
      </div>
    );
  }
}

export default AuthenLayout;

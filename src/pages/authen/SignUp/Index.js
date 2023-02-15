import React, { PureComponent } from 'react';
import { connect } from 'dva';

import styles from './Index.less';

@connect(({ signin }) => ({
  signin,
}))
class SignUp extends PureComponent {
  render() {
    return <div className={styles.main}>todo</div>;
  }
}

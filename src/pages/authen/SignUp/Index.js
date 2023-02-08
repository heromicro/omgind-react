import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';

import styles from './Index.less';

@connect(({ signin }) => ({
  signin,
}))
@Form.create()
class SignUp extends PureComponent {
  render() {
    return <div className={styles.main}>todo</div>;
  }
}

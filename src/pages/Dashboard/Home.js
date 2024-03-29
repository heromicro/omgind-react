import React, { PureComponent } from 'react';
import { connect } from 'dva';
import dayjs from 'dayjs';
import { Typography, Card, Alert } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Home.less';

function CodePreview({ children, copyable = null }) {
  return (
    <pre className={styles.pre}>
      <code>
        {copyable ? (
          <Typography.Text copyable={{ text: copyable }}>{children}</Typography.Text>
        ) : (
          <Typography.Text copyable>{children}</Typography.Text>
        )}
      </code>
    </pre>
  );
}

@connect((state) => ({
  global: state.global,
}))
class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: dayjs().format('HH:mm:ss'),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ currentTime: dayjs().format('HH:mm:ss') });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getHeaderContent = () => {
    const {
      global: { user },
    } = this.props;

    const { role_names: roleNames } = user;

    const text = [];
    if (roleNames && roleNames.length > 0) {
      text.push(
        <span key="role" style={{ marginRight: 20 }}>{`所属角色：${roleNames.join('/')}`}</span>
      );
    }

    if (text.length > 0) {
      return text;
    }
    return null;
  };

  render() {
    const {
      global: { user },
    } = this.props;

    const { currentTime } = this.state;

    const breadcrumbList = [{ title: '首页' }];

    return (
      <PageHeaderLayout
        title={`您好，${user.real_name}，祝您开心每一天！`}
        breadcrumbList={breadcrumbList}
        content={this.getHeaderContent()}
        action={<span>当前时间：{currentTime}</span>}
      >
        <Card>
          <Alert
            message="omgind 现已发布，欢迎使用下载启动体验。"
            type="success"
            showIcon
            banner
            style={{
              margin: -12,
              marginBottom: 24,
            }}
          />
          <Typography.Text strong>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/heromicro/omgind">
              1. 下载并启动服务
            </a>
          </Typography.Text>
          <CodePreview>git clone https://github.com/heromicro/omgind.git</CodePreview>
          <CodePreview>cd omgind</CodePreview>
          <CodePreview>
            go run cmd/omgind/main.go web -c ./configs/config.toml -m ./configs/model.conf --menu
            ./configs/menu.yaml
          </CodePreview>
          <CodePreview>
            启动成功之后，可在浏览器中输入地址进行访问：http://0.0.0.0:10088/swagger/index.html
          </CodePreview>
          <Typography.Text
            strong
            style={{
              marginBottom: 12,
            }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/omgind/omgind-react"
            >
              2. 下载并运行 omgind-react
            </a>
          </Typography.Text>
          <CodePreview>git clone https://github.com/heromicro/omgind-react.git</CodePreview>
          <CodePreview>cd omgind-react</CodePreview>
          <CodePreview>yarn</CodePreview>
          <CodePreview>yarn start</CodePreview>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Home;

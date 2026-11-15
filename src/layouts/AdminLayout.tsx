import { MenuIconRegistry } from '@/components/MenuIcon';
import React from 'react';
import { connect, Link, Outlet, useLocation } from '@umijs/max';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UpdatePasswordDialog from '@/components/UpdatePasswordDialog';
import context from '@/utils/context';
import logo from '../assets/logo.svg';

interface MenuNode {
  id: string;
  name: string;
  is_show: boolean;
  router?: string;
  icon?: string;
  children?: MenuNode[];
}
interface MenuRoute {
  icon?: React.ReactNode;
  key: string;
  name: string;
  path?: string;
  children?: MenuRoute[];
}
interface AdminLayoutProps {
  global: {
    title: string;
    menus: MenuNode[];
    user: { real_name: string; user_name: string };
  };
  dispatch: (action: { type: string; pathname?: string }) => void;
  location: ReturnType<typeof useLocation>;
}

class AdminLayout extends React.PureComponent<AdminLayoutProps> {
  state = { passwordVisible: false };

  componentDidMount() {
    this.props.dispatch({ type: 'global/fetchUser' });
    this.props.dispatch({
      type: 'global/fetchMenuTree',
      pathname: this.props.location.pathname,
    });
  }

  buildMenuRoutes(items: MenuNode[] = []): MenuRoute[] {
    const routes: MenuRoute[] = [];
    for (const item of items) {
      if (!item.name || !item.is_show) continue;
      routes.push({
        key: item.id,
        name: item.name,
        icon: MenuIconRegistry.render(item.icon),
        path: item.router || undefined,
        children: item.children?.length ? this.buildMenuRoutes(item.children) : undefined,
      });
    }
    return routes;
  }

  handleAccountMenu = ({ key }: { key: string }) => {
    if (key === 'password') {
      this.setState({ passwordVisible: true });
      return;
    }
    this.props.dispatch({ type: 'signin/signOut' });
  };

  closePasswordDialog = () => {
    this.setState({ passwordVisible: false });
  };

  renderMenuItem = (item: { path?: string }, content: React.ReactNode) => {
    if (item.path?.startsWith('http')) {
      return <a href={item.path} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return <Link to={item.path || '/'}>{content}</Link>;
  };

  renderAccount = (_: unknown, content: React.ReactNode) => (
    <Dropdown menu={{
      items: [
        { key: 'password', label: '修改密码' },
        { key: 'signout', label: '退出登录' },
      ],
      onClick: this.handleAccountMenu,
    }}>{content}</Dropdown>
  );

  render() {
    const { global, location } = this.props;
    return (
      <ProLayout
        title={global.title}
        logo={logo}
        layout="mix"
        location={location}
        route={{ path: '/', children: this.buildMenuRoutes(global.menus) }}
        menuItemRender={this.renderMenuItem}
        avatarProps={{
          icon: <UserOutlined />,
          title: global.user.real_name || global.user.user_name,
          render: this.renderAccount,
        }}
      >
        <context.GlobalContext.Provider value={global}>
          <Outlet />
        </context.GlobalContext.Provider>
        <UpdatePasswordDialog
          visible={this.state.passwordVisible}
          onCancel={this.closePasswordDialog}
        />
      </ProLayout>
    );
  }
}

// Router hooks stay at the boundary; layout behavior lives in the class.
function RoutedAdminLayout(props: Omit<AdminLayoutProps, 'location'>) {
  const location = useLocation();
  return <AdminLayout {...props} location={location} />;
}
export default connect(({ global }) => ({ global }))(RoutedAdminLayout);

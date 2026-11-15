import {
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  CloudOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  FileOutlined,
  FolderOutlined,
  GlobalOutlined,
  HomeOutlined,
  KeyOutlined,
  LinkOutlined,
  LockOutlined,
  MenuOutlined,
  ProfileOutlined,
  SafetyOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  SolutionOutlined,
  TableOutlined,
  TagOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Select, Space } from 'antd';
import React from 'react';

export class MenuIconRegistry {
  static readonly icons = {
    DashboardOutlined,
    TagOutlined,
    SettingOutlined,
    AuditOutlined,
    UserOutlined,
    KeyOutlined,
    SolutionOutlined,
    HomeOutlined,
    AppstoreOutlined,
    TeamOutlined,
    MenuOutlined,
    DatabaseOutlined,
    FileOutlined,
    FolderOutlined,
    SafetyOutlined,
    LockOutlined,
    ToolOutlined,
    ApartmentOutlined,
    GlobalOutlined,
    BankOutlined,
    ProfileOutlined,
    TableOutlined,
    BarChartOutlined,
    CloudOutlined,
    LinkOutlined,
    ShopOutlined,
    CalendarOutlined,
    BellOutlined,
    SearchOutlined,
    EnvironmentOutlined,
  };

  static normalize(name?: string): string {
    if (!name) return '';
    if (Object.hasOwn(MenuIconRegistry.icons, name)) return name;
    const parts = name.split('-');
    let converted = '';
    for (const part of parts) converted += part.charAt(0).toUpperCase() + part.slice(1);
    converted += 'Outlined';
    return Object.hasOwn(MenuIconRegistry.icons, converted) ? converted : name;
  }

  static render(name?: string): React.ReactNode {
    const normalized = MenuIconRegistry.normalize(name);
    if (!Object.hasOwn(MenuIconRegistry.icons, normalized)) return null;
    const Icon = MenuIconRegistry.icons[normalized as keyof typeof MenuIconRegistry.icons];
    return <Icon />;
  }
}

interface MenuIconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default class MenuIconSelect extends React.PureComponent<MenuIconSelectProps> {
  handleChange = (value?: string) => {
    this.props.onChange?.(value || '');
  };

  render() {
    const options = [];
    for (const name of Object.keys(MenuIconRegistry.icons)) {
      options.push({
        value: name,
        label: (
          <Space>
            {MenuIconRegistry.render(name)}
            {name}
          </Space>
        ),
      });
    }
    return (
      <Select
        showSearch
        allowClear
        value={MenuIconRegistry.normalize(this.props.value) || undefined}
        onChange={this.handleChange}
        optionFilterProp="value"
        placeholder="搜索并选择图标，例如 UserOutlined"
        options={options}
        style={{ width: '100%' }}
      />
    );
  }
}

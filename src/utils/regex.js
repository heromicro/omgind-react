const patterns = {
  regex: {
    name: '^[a-zA-Z_][0-9a-zA-Z_\\-]{0,}$',
    mobile: '^1[2-9]\\d{0,}$',
    email: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
    pwd:
      '^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\\(\\)])+$)([^(0-9a-zA-Z)]|[\\(\\)]|[a-z]|[A-Z]|[0-9]){8,}$',
    IP:
      '^(?=(\\b|\\D))(((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))\\.){3}((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))(?=(\\b|\\D))$',
    IDCard: '(^\\d{15}$)|(^\\d{17}([0-9]|X)$)',
  },
  message: {
    name: '请以字母、下划线开头并包括数字、字母、下划线组成',
    mobile: '非正确的号码',
    email: '非正确的邮箱地址',
    pwd: '密码至少由8位包含字母、数字、特殊字符两种组合',
    IP: '非正确IP地址',
    IDCard: '非正确身份证号码',
  },
};

// eslint-disable-next-line import/prefer-default-export
export const pattern = (name, para = 'g') => {
  return {
    pattern: new RegExp(patterns.regex[name], para),
    message: patterns.message[name],
  };
};

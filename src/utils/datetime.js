import moment from 'moment';

// 格式化时间戳
export function formatTimestamp(val, format) {
  let f = 'YYYY-MM-DD HH:mm:ss';
  if (format) {
    f = format;
  }
  return moment.unix(val).format(f);
}

// 解析时间戳
export function parseTimestamp(val) {
  return moment.unix(val);
}

// 解析日期
export function parseDate(val) {
  return moment(val);
}

// 格式化日期
export function formatDate(val, format) {
  let f = 'YYYY-MM-DD HH:mm:ss';
  if (format) {
    f = format;
  }
  return moment(val).format(f);
}

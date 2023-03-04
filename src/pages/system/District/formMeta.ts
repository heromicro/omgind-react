/* eslint-disable */
export const DistrictFormSchema = {
  type: 'object',
  column: 2,
  labelWidth: 120,
  displayType: 'column',
  properties: {
    name: {
      title: '名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      required: true,
      maxLength: 128,
      displayType: 'column',
      description: '',
      bind: 'name',
      hidden: false,
      placeholder: '请输入名称',
    },
    pid: {
      title: '上级',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select',
      displayType: 'column',
      bind: 'pid',
      placeholder: '请选择上级',
    },
    sname: {
      title: '短名称',
      type: 'string',
      displayType: 'column',
      bind: 'sname',
      props: {
        allowClear: true,
      },
      placeholder: '请输入短名称',
      maxLength: 64,
    },
    abbr: {
      title: '简称',
      type: 'string',
      displayType: 'column',
      placeholder: '请输入简称',
      bind: 'abbr',
      props: {
        allowClear: true,
      },
      maxLength: 64,
    },
    merge_name: {
      title: '行政名称',
      type: 'string',
      displayType: 'column',
      bind: 'merge_name',
      props: {
        allowClear: true,
      },
      maxLength: 256,
    },
    merge_sname: {
      title: '行政短名称',
      type: 'string',
      displayType: 'column',
      bind: 'merge_sname',
      props: {
        allowClear: true,
      },
      maxLength: 256,
    },
    suffix: {
      title: '行政后缀',
      type: 'string',
      displayType: 'column',
      props: {
        allowClear: true,
      },
      maxLength: 16,
      bind: 'suffix',
    },
    html_Yb4Skn: {
      title: 'HTML',
      type: 'string',
      widget: 'html',
      props: {},
      displayType: 'column',
      readOnly: true,
    },
    pinyin: {
      title: '拼音',
      type: 'string',
      displayType: 'column',
      bind: 'pinyin',
      props: {
        allowClear: true,
      },
      maxLength: 128,
    },
    input__vp7_b: {
      title: '简拼',
      type: 'string',
      displayType: 'column',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      bind: 'initials',
    },
    input_Bslexk: {
      title: '区号',
      type: 'string',
      props: {
        allowClear: true,
      },
      displayType: 'column',
      maxLength: 8,
      bind: 'area_code',
    },
    input_n4mwB_: {
      title: '邮码',
      type: 'string',
      displayType: 'column',
      props: {
        allowClear: true,
      },
      maxLength: 8,
      bind: 'zip_code',
    },
  },
};

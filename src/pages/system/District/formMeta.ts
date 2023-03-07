/* eslint-disable */
// The Great Britain of United Kingdom
export const DistrictFormSchema = {
  type: 'object',
  labelWidth: 120,
  displayType: 'column',
  column: 2,
  properties: {
    name: {
      title: '名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      required: true,
      maxLength: 128,
      bind: 'name',
      placeholder: '请输入名称',
    },
    name_en: {
      title: '英语名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      bind: 'name_en',
      placeholder: '请输入英语名称',
    },
    sname: {
      title: '短名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 64,
      bind: 'sname',
      placeholder: '请输入短名称',
    },
    sname_en: {
      title: '英语短名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 64,
      bind: 'sname_en',
      placeholder: '请输入英语短名称',
    },
    pid: {
      title: '上级',
      type: 'string',
      widget: 'district',
      placeholder: '请选择上级',
      bind: 'pid',
    },
    abbr: {
      title: '简称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 16,
      placeholder: '请输入简称',
      bind: 'abbr',
    },
    merge_name: {
      title: '行政名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 256,
      placeholder: '请输入行政名称',
      bind: 'merge_name',
    },
    merge_sname: {
      title: '行政短名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 256,
      placeholder: '请输入行政短名称',
      bind: 'merge_sname',
    },
    suffix: {
      title: '行政后缀',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 16,
      placeholder: '请输入行政后缀',
      bind: 'suffix',
    },
    pinyin: {
      title: '拼音',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      placeholder: '请输入拼音',
      bind: 'pinyin',
    },
    initials: {
      title: '简拼',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      placeholder: '请输入简拼',
      bind: 'initials',
    },
    area_code: {
      title: '区号',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 8,
      placeholder: '请输入区号',
      bind: 'area_code',
    },
    zip_code: {
      title: '邮码',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 8,
      bind: 'zip_code',
      placeholder: '请输入邮码',
    }, 
    is_active: {
      title: '是否有效',
      type: 'boolean',
      widget: 'switch',
      default: true,
      bind: 'is_active',
    },
    is_main: {
      title: '是否主要',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_main',
    },
    is_real: {
      title: '是否真实',
      type: 'boolean',
      widget: 'switch',
      default: true,
      bind: 'is_real',
    },
    is_hot: {
      title: '是否热点',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_hot',
    },
    is_direct: {
      title: '是否直辖',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_direct',
    },
  },
};

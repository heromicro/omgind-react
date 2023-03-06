/* eslint-disable */
// The Great Britain of United Kingdom
export const DistrictFormSchema = {
  type: 'object',
  labelWidth: 120,
  displayType: 'column',
  column: 2,
  properties: {
    input_a6S1dv: {
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
    input_QUDA9R: {
      title: '英语名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      bind: 'name_en',
      placeholder: '请输入英语名称',
    },
    input_QHFPpT: {
      title: '短名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 64,
      bind: 'sname',
      placeholder: '请输入短名称',
    },
    input_ZGVbYu: {
      title: '英语短名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 64,
      bind: 'sname_en',
      placeholder: '请输入英语短名称',
    },
    select_Ntj6Yx: {
      title: '上级',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select',
      placeholder: '请选择上级',
      bind: 'pid',
    },
    input_mYAR0H: {
      title: '简称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 64,
      placeholder: '请输入简称',
      bind: 'abbr',
    },
    input_tOMu8C: {
      title: '行政名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 256,
      placeholder: '请输入行政名称',
      bind: 'merge_name',
    },
    input_weWqJv: {
      title: '行政短名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 256,
      placeholder: '请输入行政短名称',
      bind: 'merge_sname',
    },
    input_Uh68U3: {
      title: '行政后缀',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 16,
      placeholder: '请输入行政后缀',
      bind: 'suffix',
    },
    input_sICl7S: {
      title: '拼音',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      placeholder: '请输入拼音',
      bind: 'pinyin',
    },
    input_H79d6K: {
      title: '简拼',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 128,
      placeholder: '请输入简拼',
      bind: 'initials',
    },
    input_hUoeQR: {
      title: '区号',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 8,
      placeholder: '请输入区号',
      bind: 'area_code',
    },
    input_wA6wgv: {
      title: '邮码',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 8,
      bind: 'zip_code',
      placeholder: '请输入邮码',
    },
    switch_1DYOgA: {
      title: '是否有效',
      type: 'boolean',
      widget: 'switch',
      default: true,
      bind: 'is_active',
    },
    switch_nFniaw: {
      title: '是否主要',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_main',
    },
    switch_1HLMM8: {
      title: '是否真实',
      type: 'boolean',
      widget: 'switch',
      default: true,
      bind: 'is_real',
    },
    switch_wTE0rL: {
      title: '是否热点',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_hot',
    },
    switch_zo7CJT: {
      title: '是否直辖',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_direct',
    },
  },
};
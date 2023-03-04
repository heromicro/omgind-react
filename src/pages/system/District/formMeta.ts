/* eslint-disable */
export const DistrictFormSchema = {
  type: 'object',
  column: 2,
  labelWidth: 120,
  displayType: 'row',
  properties: {
    name: {
      title: '名称',
      type: 'string',
      props: {
        allowClear: true,
      },
      required: true,
      maxLength: 128,
      description: '',
      bind: 'name',
      width: '100%',
      placeholder: '请输入名称',
    },
    pid: {
      title: '上级',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select',
      bind: 'pid',
      placeholder: '请选择上级',
    },
    sname: {
      title: '短名称',
      type: 'string',
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
      bind: 'merge_name',
      props: {
        allowClear: true,
      },
      maxLength: 256,
    },
    merge_sname: {
      title: '行政短名称',
      type: 'string',
      bind: 'merge_sname',
      props: {
        allowClear: true,
      },
      maxLength: 256,
    },
    suffix: {
      title: '行政后缀',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 16,
      bind: 'suffix',
    },
    pinyin: {
      title: '拼音',
      type: 'string',
      bind: 'pinyin',
      props: {
        allowClear: true,
      },
      maxLength: 128,
    },
    input__vp7_b: {
      title: '简拼',
      type: 'string',
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
      maxLength: 8,
      bind: 'area_code',
    },
    input_n4mwB_: {
      title: '邮码',
      type: 'string',
      props: {
        allowClear: true,
      },
      maxLength: 8,
      bind: 'zip_code',
    },
    switch_1DYOgA: {
      title: '是否有效',
      type: 'boolean',
      widget: 'switch',
      default: true,
      bind: 'is_active',
    },
    switch_PtXQte: {
      title: '是否主要',
      type: 'boolean',
      widget: 'switch',
      bind: 'is_main',
    },
    switch_bzDGvw: {
      title: '是否真实',
      type: 'boolean',
      widget: 'switch',
      default: true,
      bind: 'is_real',
    },
    switch_GcTbuJ: {
      title: '是否热点',
      type: 'boolean',
      widget: 'switch',
      bind: 'is_hot',
    },
    switch_orG0Zt: {
      title: '是否直辖',
      type: 'boolean',
      widget: 'switch',
      default: false,
      bind: 'is_direct',
    },
  },
};

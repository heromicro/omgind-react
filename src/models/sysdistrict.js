import { message } from 'antd';
import qs from 'qs';

import * as districtService from '@/services/sysdistrict';
import store from '@/utils/store';

export default {
  namespace: 'sysdistrict',
  state: {
    search: {},
    pagination: {
      current: 1,
      pageSize: 50,
    },
    data: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formType: '',
    formTitle: '',
    formID: '',
    detailDrawerOpen: false,
    formDrawerOpen: false,
    formVisible: false,
    formData: {},
    detailData: {},
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {};

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select((state) => state.sysdistrict.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select((state) => state.sysdistrict.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(districtService.query, params);
      const { code, burden } = response;
      if (code === 0) {
        yield put({
          type: 'saveData',
          payload: burden,
        });
      }
    },
    *loadForm({ payload }, { put }) {
      console.log(' ----- ======  111111  ');

      yield [
        put({
          type: 'changeDetailDrawerOpen',
          payload: false,
        }),
        put({
          type: 'changeFormDrawerOpen',
          payload: true,
        }),
      ];

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新建行政区域',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      console.log(' ----- ======  222222  ', payload);

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑行政区域',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: { id: payload.id },
          }),
        ];
      } else {
        console.log(' ----- ======  33333  ');

        yield [
          put({
            type: 'changeFormVisible',
            payload: true,
          }),
        ];
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(districtService.get, payload.id);
      const { code, burden } = response;
      if (code === 0) {
        yield [
          put({
            type: 'saveFormData',
            payload: burden,
          }),
          put({
            type: 'changeFormVisible',
            payload: true,
          }),
        ];
      }
    },
    *loadDetail({ payload }, { call, put, select }) {
      yield put({
        type: 'changeDetailDrawerOpen',
        payload: true,
      });
      let { record } = payload;
      // yield put({
      //   type: 'saveDetailData',
      //   payload: record,
      // });

      const response = yield call(districtService.view, record.id);
      console.log(' -- --- - === == ', response);
      const { code, burden } = response;
      if (code === 0) {
        yield [
          put({
            type: 'saveDetailData',
            payload: burden,
          }),
        ];
      }
    },
    *submit({ payload, callback = null }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      console.log(' ---- ==== ==payload= ', payload);

      const params = { ...payload };
      const formType = yield select((state) => state.sysdistrict.formType);
      let success = false;
      if (formType === 'E') {
        const id = yield select((state) => state.sysdistrict.formID);
        const response = yield call(districtService.update, id, params);
        const { code } = response;
        if (code === 0) {
          success = true;
        }
      } else {
        const response = yield call(districtService.create, params);
        const { code, burden } = response;
        if (code === 0) {
          success = true;
        }
        if (callback) {
          callback(success, burden);
        }
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        message.success('保存成功');
        yield put({
          type: 'changeFormDrawerOpen',
          payload: false,
        });
        if (!callback) {
          yield put({
            type: 'fetch',
          });
        }
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(districtService.del, payload.id);
      const { code } = response;
      if (code === 0) {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      let response;
      if (payload.is_active === true) {
        response = yield call(districtService.enable, payload.id);
      } else {
        response = yield call(districtService.disable, payload.id);
      }

      const { code } = response;
      if (code === 0) {
        let msg = '启用成功';
        if (payload.is_active === false) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state) => state.sysdistrict.data);
        const newData = { list: [], pagination: data.pagination };

        for (let i = 0; i < data.list.length; i += 1) {
          const item = data.list[i];
          if (item.id === payload.id) {
            item.is_active = payload.is_active;
          }
          newData.list.push(item);
        }

        yield put({
          type: 'saveData',
          payload: newData,
        });
      }
    },

    *fetchAllDistricts({ params, callback = null }, { call, put, select }) {
      const nparams = params;
      let mkey = nparams.pid;
      if (nparams && (nparams.pid === '' || nparams.pid === null || nparams.pid === undefined)) {
        nparams.pid = '-';
      }

      if (nparams && !nparams.current) {
        nparams.current = 1;
      }

      if (nparams && !nparams.pageSize) {
        nparams.pageSize = 100;
      }

      let skey = qs.stringify(nparams);
      // console.log(' ----- === ----- == skey == ', skey);

      let list = store.getExpirableItem(skey);
      if (!list || list.length === 0) {
        let response = yield call(districtService.getSubstricts, nparams.pid, nparams);
        const { code, burden } = response;
        if (code === 0) {
          list = burden.list || [];
          if (list.length > 0) {
            store.setExpirableItem(skey, list, 20);
          }
        }
      }

      // yield put({
      //   type: 'saveSubDistrict',
      //   pid: nparams.pid,
      //   payload: list,
      // });
      if (callback) {
        callback(list);
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    changeDetailDrawerOpen(state, { payload }) {
      return { ...state, detailDrawerOpen: payload };
    },
    changeFormVisible(state, { payload }) {
      if (payload) {
        return { ...state, formDrawerOpen: payload, formVisible: payload };
      }
      return { ...state, formVisible: payload };
    },
    changeFormDrawerOpen(state, { payload }) {
      if (!payload) {
        return {
          ...state,
          formDrawerOpen: payload,
          formVisible: payload,
          formData: {},
          formID: '',
        };
      }
      return { ...state, formDrawerOpen: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    saveDetailData(state, { payload }) {
      return { ...state, detailData: payload };
    },
  },
};

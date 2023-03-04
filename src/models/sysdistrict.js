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
    formTitle: '',
    formID: '',
    formModalVisible: false,
    formVisible: false,
    formData: {},
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
        const s = yield select((state) => state.district.search);
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
        const p = yield select((state) => state.district.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(districtService.query, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put }) {
      yield put({
        type: 'changeModalFormVisible',
        payload: true,
      });

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
      yield [
        put({
          type: 'saveFormData',
          payload: response,
        }),
        put({
          type: 'changeFormVisible',
          payload: true,
        }),
      ];
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state) => state.district.formType);
      let success = false;
      if (formType === 'E') {
        const id = yield select((state) => state.district.formID);
        const response = yield call(districtService.update, id, params);
        if (response.status === 'OK') {
          success = true;
        }
      } else {
        const response = yield call(districtService.create, params);
        if (response.id && response.id !== '') {
          success = true;
        }
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        message.success('保存成功');
        yield put({
          type: 'changeModalFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(districtService.del, payload.id);
      if (response.status === 'OK') {
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

      if (response.status === 'OK') {
        let msg = '启用成功';
        if (payload.is_active === false) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state) => state.district.data);
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
        if (response) {
          list = response.list || [];
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
    changeFormVisible(state, { payload }) {
      if (payload) {
        return { ...state, formModalVisible: payload, formVisible: payload };
      }
      return { ...state, formVisible: payload };
    },
    changeModalFormVisible(state, { payload }) {
      if (!payload) {
        return { ...state, formModalVisible: payload, formVisible: payload };
      }
      return { ...state, formModalVisible: payload };
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
  },
};

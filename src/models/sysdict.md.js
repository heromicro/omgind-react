import { message } from 'antd';
import * as dictService from '@/services/sysdict.svc';

export default {
  namespace: 'sysdict',
  state: {
    search: {},
    pagination: {},
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

    selectData: [],
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
        const s = yield select((state) => state.sysdict.search);
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
        const p = yield select((state) => state.sysdict.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(dictService.query, params);
      const { code, burden } = response;
      if (code === 0) {
        yield put({
          type: 'saveData',
          payload: burden,
        });
      }
    },

    *loadForm({ payload }, { put }) {
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
          payload: '新建字典',
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
            payload: '编辑字典',
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
      const response = yield call(dictService.get, payload.id);
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

    *submit({ payload }, { call, put, select }) {
      console.log(` = +++++++ vvvvvvvv ===== ${payload}`);

      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      console.log(` = +++++++ vvvvvvvv ===== 111 ${payload}`);

      const params = { ...payload };
      const formType = yield select((state) => state.sysdict.formType);
      let success = false;

      console.log(` = +++++++ vvvvvvvv ===== 111 ${formType}`);

      if (formType === 'E') {
        const id = yield select((state) => state.sysdict.formID);
        const response = yield call(dictService.update, id, params);
        const { code } = response;
        if (code === 0) {
          success = true;
        }
      } else {
        const response = yield call(dictService.create, params);
        const { code } = response;
        if (code === 0) {
          success = true;
        }
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      console.log(` +++++ ++++++++ ====== ${success} `);

      if (success) {
        message.success('保存成功');
        yield put({
          type: 'changeFormDrawerOpen',
          payload: false,
        });
        yield put({ type: 'fetch' });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(dictService.del, payload.id);
      const { code } = response;
      if (code === 0) {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      let response;
      if (payload.is_active === true) {
        response = yield call(dictService.enable, payload.id);
      } else {
        response = yield call(dictService.disable, payload.id);
      }
      const { code } = response;
      if (code === 0) {
        let msg = '启用成功';
        if (payload.is_active === false) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state) => state.sysdict.data);
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
        return { ...state, formDrawerOpen: payload, formVisible: payload };
      }
      return { ...state, formVisible: payload };
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
    saveSelectData(state, { payload }) {
      return { ...state, selectData: payload };
    },

    saveDetailData(state, { payload }) {
      return { ...state, detailData: payload };
    },
    changeDetailDrawerOpen(state, { payload }) {
      return { ...state, detailDrawerOpen: payload };
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
  },
};

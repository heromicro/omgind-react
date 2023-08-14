import { message } from 'antd';
import * as userService from '@/services/sysuser';

export default {
  namespace: 'sysuser',
  state: {
    search: {},
    pagination: {},
    data: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formTitle: '',
    formID: '',
    detailDrawerOpen: false,
    formModalVisible: false,
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
        const s = yield select((state) => state.sysuser.search);
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
        const p = yield select((state) => state.sysuser.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(userService.query, params);
      const { code, burden } = response;
      if (code === 0) {
        yield put({
          type: 'saveData',
          payload: burden,
        });
      }
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
          payload: '新建用户',
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
            payload: '编辑用户',
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
      const response = yield call(userService.get, payload.id);
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

    // ------------------------
    *loadDetail({ payload }, { call, put, select }) {
      // const response = yield call(assetService.get, payload.id);
      yield put({
        type: 'changeDetailDrawerOpen',
        payload: true,
      });
      let { record } = payload;
      yield put({
        type: 'saveDetailData',
        payload: record,
      });
    },

    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state) => state.sysuser.formType);
      let success = false;
      if (formType === 'E') {
        const id = yield select((state) => state.sysuser.formID);
        const response = yield call(userService.update, id, params);
        const { code } = response;
        if (code === 0) {
          success = true;
        }
      } else {
        const response = yield call(userService.create, params);
        const { code } = response;
        if (code === 0) {
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
      const response = yield call(userService.del, payload.id);
      const { code } = response;
      if (code === 0) {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      let response;
      if (payload.is_active === true) {
        response = yield call(userService.enable, payload.id);
      } else {
        response = yield call(userService.disable, payload.id);
      }

      const { code, burden } = response;
      if (code === 0) {
        let msg = '启用成功';
        if (payload.is_active === false) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state) => state.sysuser.data);
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
    changeDetailDrawerOpen(state, { payload }) {
      return { ...state, detailDrawerOpen: payload };
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
    saveDetailData(state, { payload }) {
      return { ...state, detailData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
  },
};

import { message } from 'antd';
import * as menuService from '@/services/menu';

export default {
  namespace: 'menu',
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
    formModalVisible: false,
    formVisible: false,
    formData: {},
    treeData: [],
    expandedKeys: [],
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {
        parentID: '',
      };

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.menu.search);
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
        const p = yield select(state => state.menu.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(menuService.query, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put, select }) {
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
          payload: '新建菜单',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
        put({ type: 'fetchTree' }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑菜单',
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
        const search = yield select(state => state.menu.search);
        yield put({
          type: 'saveFormData',
          payload: { parent_id: search.parentID ? search.parentID : '' },
        });
        yield [
          put({
            type: 'changeFormVisible',
            payload: true,
          }),
        ];
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(menuService.get, payload.id);
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
      const formType = yield select(state => state.menu.formType);
      let success = false;
      if (formType === 'E') {
        const id = yield select(state => state.menu.formID);
        const response = yield call(menuService.update, id, params);
        if (response.status === 'OK') {
          success = true;
        }
      } else {
        const response = yield call(menuService.create, params);
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

        yield put({ type: 'fetchTree' });
        yield put({ type: 'fetch' });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(menuService.del, payload.id);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchTree' });
        yield put({ type: 'fetch' });
      }
    },

    *fetchTree({ payload }, { call, put }) {
      let params = {};
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(menuService.queryTree, params);
      yield put({
        type: 'saveTreeData',
        payload: response.list || [],
      });
    },

    *changeStatus({ payload }, { call, put, select }) {
      let response;
      if (payload.status === 1) {
        response = yield call(menuService.enable, payload.id);
      } else {
        response = yield call(menuService.disable, payload.id);
      }

      if (response.status === 'OK') {
        let msg = '启用成功';
        if (payload.status === 2) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select(state => state.menu.data);
        const newData = { list: [], pagination: data.pagination };

        for (let i = 0; i < data.list.length; i += 1) {
          const item = data.list[i];
          if (item.id === payload.id) {
            item.status = payload.status;
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
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
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
    saveTreeData(state, { payload }) {
      return { ...state, treeData: payload };
    },
    saveExpandedKeys(state, { payload }) {
      return { ...state, expandedKeys: payload };
    },
  },
};

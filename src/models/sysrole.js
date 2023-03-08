import { message } from 'antd';
import * as roleService from '@/services/sysrole';

export default {
  namespace: 'role',
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
    formModalVisible: false,
    formVisible: false,
    formData: {},
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
        const s = yield select((state) => state.role.search);
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
        const p = yield select((state) => state.role.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(roleService.query, params);
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
          payload: '新建角色',
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
            payload: '编辑角色',
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
      const response = yield call(roleService.get, payload.id);

      const { code, burden } = response;
      if (code === 0) {
        const { role_menus: roleMenus } = burden;
        if (roleMenus) {
          const mRoleMenus = {};
          const nRoleMenus = [];
          roleMenus.forEach((item) => {
            if (mRoleMenus[item.menu_id]) {
              mRoleMenus[item.menu_id] = [...mRoleMenus[item.menu_id], item.action_id];
            } else {
              mRoleMenus[item.menu_id] = [item.action_id];
            }
          });
          Object.keys(mRoleMenus).forEach((key) => {
            nRoleMenus.push({ menu_id: key, actions: mRoleMenus[key] });
          });
          burden.role_menus = nRoleMenus;
        }
      }

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
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state) => state.role.formType);

      console.log(' ----- ====== ==== payload == ', payload);
      console.log(' ----- ====== ==== formType == ', formType);
      console.log(' ----- ====== ==== formType == ', formType === 'E');

      let success = false;
      if (formType === 'E') {
        const id = yield select((state) => state.role.formID);
        console.log(' ----- ====== ==== id == ', id);

        const response = yield call(roleService.update, id, params);
        console.log(' ----- ====== ==== response  == ', response);
        const { code } = response;
        if (code === 0) {
          success = true;
        }
      } else {
        const response = yield call(roleService.create, params);
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
      const response = yield call(roleService.del, payload.id);
      const { code } = response;
      if (code === 0) {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *fetchSelect(_, { call, put }) {
      const response = yield call(roleService.querySelect);
      const { code, burden } = response;
      if (code === 0) {
        yield put({
          type: 'saveSelectData',
          payload: burden.list || [],
        });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      let response;
      if (payload.is_active === true) {
        response = yield call(roleService.enable, payload.id);
      } else {
        response = yield call(roleService.disable, payload.id);
      }

      const { code, burden } = response;
      if (code === 0) {
        let msg = '启用成功';
        if (payload.is_active === false) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state) => state.role.data);
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
    saveSelectData(state, { payload }) {
      return { ...state, selectData: payload };
    },
  },
};

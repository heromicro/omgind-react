import * as signinService from '@/services/signin';
import store from '@/utils/store';

export default {
  namespace: 'global',

  state: {
    title: '权限管理脚手架',
    copyRight: 'mit',
    defaultURL: '/dashboard',
    collapsed: false,
    openKeys: [],
    selectedKeys: [],
    user: {
      user_name: 'admin',
      real_name: '管理员',
      role_names: [],
    },
    menuPaths: {},
    menuMap: {},
    menus: [],
  },

  effects: {
    *menuEvent({ pathname }, { put, select }) {
      let p = pathname;
      if (p === '/') {
        p = yield select((state) => state.global.defaultURL);
      }

      const menuPaths = yield select((state) => state.global.menuPaths);
      const item = menuPaths[p];
      if (!item) {
        return;
      }

      if (item.parent_path && item.parent_path !== '') {
        yield put({
          type: 'changeOpenKeys',
          payload: item.parent_path.split('/'),
        });
      }

      yield put({
        type: 'changeSelectedKeys',
        payload: [item.id],
      });
    },
    *fetchUser(_, { call, put }) {
      const response = yield call(signinService.getCurrentUser);
      const { code, burden } = response;
      if (code === 0) {
        yield put({
          type: 'saveUser',
          payload: burden,
        });
      }
    },
    *fetchMenuTree({ pathname }, { call, put }) {
      let skey = 'admin-current-user-menu';
      let list = store.getExpirableItem(skey);
      if (!list) {
        const response = yield call(signinService.queryMenuTree);

        console.log(' -----  dddd ===== ', response);

        const { code, burden } = response;
        if (code === 0) {
          if (burden.list) {
            list = burden.list;
            store.setExpirableItem(skey, burden.list, 10);
          }
        }
      }

      const menuData = list || [];
      yield put({
        type: 'saveMenus',
        payload: menuData,
      });

      console.log(' ----- ===== menuData ----- ', menuData);

      const menuPaths = {};
      const menuMap = {};
      function fillData(data) {
        for (let i = 0; i < data.length; i += 1) {
          menuMap[data[i].id] = data[i];
          if (data[i].router !== '') {
            menuPaths[data[i].router] = data[i];
          }
          if (data[i].children && data[i].children.length > 0) {
            fillData(data[i].children);
          }
        }
      }
      fillData(menuData);

      yield [
        put({
          type: 'saveMenuPaths',
          payload: menuPaths,
        }),
        put({
          type: 'saveMenuMap',
          payload: menuMap,
        }),
        put({
          type: 'menuEvent',
          pathname,
        }),
      ];
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeOpenKeys(state, { payload }) {
      return {
        ...state,
        openKeys: payload,
      };
    },
    changeSelectedKeys(state, { payload }) {
      return {
        ...state,
        selectedKeys: payload,
      };
    },
    saveUser(state, { payload }) {
      return { ...state, user: payload };
    },
    saveMenuPaths(state, { payload }) {
      return { ...state, menuPaths: payload };
    },
    saveMenuMap(state, { payload }) {
      return { ...state, menuMap: payload };
    },
    saveMenus(state, { payload }) {
      return { ...state, menus: payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        dispatch({
          type: 'menuEvent',
          pathname,
        });
      });
    },
  },
};

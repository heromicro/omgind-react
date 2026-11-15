import { history } from '@umijs/max';

import { setToken, signOut, selectOrgan, clearOrgan } from '@/utils/request';

import * as signinService from '@/services/signin.svc';

export default {
  namespace: 'signin',

  state: {
    organizations: null,
    status: '',
    tip: '',
    submitting: false,
    captchaID: '',
    captcha: '',
  },

  effects: {
    *loadOrganizations(_, { call, put }) {
      const response = yield call(signinService.organizations);
      if (response.code === 0) yield put({ type: 'saveOrganizations', payload: response.burden || [] });
    },
    *loadCaptcha(_, { call, put }) {
      const response = yield call(signinService.captchaID);
      const {
        code,
        burden: { captcha_id: captchaID },
      } = response;
      if (code === 0) {
        yield put({
          type: 'saveCaptchaID',
          payload: captchaID,
        });
        yield put({
          type: 'saveCaptcha',
          payload: signinService.captcha(captchaID),
        });
      }
    },
    *reloadCaptcha(_, { put, select }) {
      const captchaID = yield select((state) => state.signin.captchaID);
      yield put({
        type: 'saveCaptcha',
        payload: `${signinService.captcha(captchaID)}&reload=${Math.random()}`,
      });
    },
    *signIn({ payload, callback = null }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });


      const response = yield call(signinService.signIn, payload);
      const { code, burden, message: msg } = response;
      if (code !== 0) {
        // FIXME:

        console.log(' ---- response === ', response);
        // console.log(' ---- burden === ', burden);

        yield [
          put({
            type: 'saveTip',
            payload: msg,
          }),
          put({
            type: 'saveStatus',
            payload: 'FAIL',
          }),
          put({
            type: 'changeSubmitting',
            payload: false,
          }),
          put({
            type: 'loadCaptcha',
          }),
        ];
        if (callback) {
          callback(code, msg);
        }
        return;
      }

      // 保存访问令牌
      clearOrgan();
      setToken(burden);

      yield [
        put({
          type: 'saveTip',
          payload: '',
        }),
        put({
          type: 'saveStatus',
          payload: '',
        }),
        put({
          type: 'changeSubmitting',
          payload: false,
        }),
      ];

      history.replace('/');

    },

    *skipOrgan() {
      clearOrgan();
      history.replace('/');
    },
    *chooseOrgan({ payload }, { select }) {
      const organizations = yield select(state => state.signin.organizations);
      const organ = organizations?.find(item => item.id === payload);
      if (!organ) return;
      selectOrgan(organ);
      history.replace('/');
    },
    *createOrgan({ payload }, { call, put }) {
      const result = yield call(signinService.createOrganization, { ...payload, is_active: true, haddr: {} });
      if (result.code !== 0) return;
      const response = yield call(signinService.organizations);
      if (response.code === 0) yield put({ type: 'saveOrganizations', payload: response.burden || [] });
    },
    *signOut(_, { call, put }) {
      console.log(' -------- 0000000 ======= ');
      const response = yield call(signinService.signOut);
      const { code } = response;
      if (code === 0) {
        yield put({ type: 'saveOrganizations', payload: null });
        signOut();
      }
    },
  },

  reducers: {
    saveOrganizations(state, { payload }) { return { ...state, organizations: payload }; },
    saveCaptchaID(state, { payload }) {
      return {
        ...state,
        captchaID: payload,
      };
    },
    saveCaptcha(state, { payload }) {
      return {
        ...state,
        captcha: payload,
      };
    },
    saveStatus(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
    saveTip(state, { payload }) {
      return {
        ...state,
        tip: payload,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};

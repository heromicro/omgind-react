import qs from 'qs';
import { history } from 'umi';

import { setToken, signOut } from '@/utils/request';

import * as signinService from '@/services/signin.svc';

export default {
  namespace: 'signin',

  state: {
    status: '',
    tip: '',
    submitting: false,
    captchaID: '',
    captcha: '',
  },

  effects: {
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

      console.log(' ---- pppppp === ', payload);

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

      const params = qs.parse(window.location.href.split('?')[1]);
      const { redirect } = params;
      if (redirect) {
        window.location.href = redirect;
        return;
      }
      history.replace('/');
    },

    *signOut(_, { call }) {
      console.log(' -------- 0000000 ======= ');
      const response = yield call(signinService.signOut);
      const { code } = response;
      if (code === 0) {
        signOut();
      }
    },
  },

  reducers: {
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

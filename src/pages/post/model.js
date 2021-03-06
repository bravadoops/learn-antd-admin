import modelExtend from 'dva-model-extend'
import { query } from './service'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {

  namespace: 'post',

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/post') {
          dispatch({
            type: 'query',
            payload: {
              status: 2,
              ...location.query,
            },
          })
        }
      })
    },
  },

  // namespace: list的state有list pagination从payload可以看出
  effects: {
    * query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      } else {
        throw data
      }
    },
  },
})

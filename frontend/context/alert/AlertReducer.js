import {
  ALERT_SHOW,
  ALERT_HIDE
} from '../types'

const handlers = {
  [ALERT_SHOW]: (state, action) => action.payload,
  [ALERT_HIDE]: () => null,
  DEFAULT: state => state
}

export const AlertReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}
import Cookie from 'js-cookie';
import { ThunkType } from '@/types/thunk';
import { instance } from '@/api/api';
import { show } from './alert';
import { trigger } from 'swr';

export const joinGroup = (partyId: number, isJoin: boolean, triggerLink: string): ThunkType => async dispatch => {
  let joinLink = `/api/v1/group/join/${partyId}/`;
  if (isJoin) {
    joinLink = `/api/v1/group/leave/${partyId}/`
  }
  const token = Cookie.get('token');
  await instance(token)
    .post(joinLink)
    .then(res => {
      dispatch(show('Вы успешно добавились в группу!', 'success'));
      trigger(triggerLink)
    })
    .catch(err => {
      dispatch(show('Ошибка в добавлении в группу!', 'warning'));
      trigger(triggerLink)
    });
};



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

export const teamChange = (name: string, info: string, partyId: number): ThunkType => async dispatch => {
  const token = Cookie.get('token');
  await instance(token)
    .patch(`/api/v1/group/${partyId}/`, {
      name: name,
      // info: info
    })
    .then(res => {
      dispatch(show('Вы успешно сменили данные о сообществе!', 'success'));
    })
    .catch(err => {
      dispatch(show('Ошибка в смене данных о сообществе!', 'warning'));
    });
};

export const teamAddStaff = (staffId: number, partyId: number, isRemove?: boolean): ThunkType => async dispatch => {
  const token = Cookie.get('token');
  let url = `/api/v1/group/staff/add/${partyId}/`;
  if (isRemove) {
    url = `/api/v1/group/staff/remove/${partyId}/`
  }
  await instance(token)
    .post(url, {
      some_id: staffId,
    })
    .then(res => {
      let text = 'Вы успешно добавили стафф!';
      if (isRemove) {
        text = 'Вы успешно удалили стафф!'
      }
      dispatch(show(text, 'success'));
      trigger(`/api/v1/group/${partyId}/`);
    })
    .catch(err => {
      let text = 'Ошибка в добавлении стаффа!';
      if (isRemove) {
        text = 'Ошибка в удалении стаффа!'
      }
      dispatch(show(text, 'warning'));
      trigger(`/api/v1/group/${partyId}/`);
    });
};

export const teamAddBlackList = (staffId: number, partyId: number, isRemove?: boolean): ThunkType => async dispatch => {
  const token = Cookie.get('token');
  let url = `/api/v1/group/blacklist/add/${partyId}/`;
  if (isRemove) {
    url = `/api/v1/group/blacklist/remove/${partyId}/`
  }
  await instance(token)
    .post(url, {
      some_id: staffId,
    })
    .then(res => {
      let text = 'Вы успешно добавили в черный список!';
      if (isRemove) {
        text = 'Вы успешно удалили из черного списка!'
      }
      dispatch(show(text, 'success'));
      trigger(`/api/v1/group/${partyId}/`);
    })
    .catch(err => {
      let text = 'Ошибка в добавлении в черный список!';
      if (isRemove) {
        text = 'Ошибка в удалении из черного списка!'
      }
      dispatch(show(text, 'warning'));
      trigger(`/api/v1/group/${partyId}/`);
    });
};

export const teamImageChange = (
  image: any,
  triggerUrl: string,
  postPartyUrl: string
): ThunkType => async dispatch => {

  const token = Cookie.get('token');

  let form_data = new FormData();
  form_data.append('image', image, image.name);

  await instance(token)
    .patch(triggerUrl, form_data)
    .then(res => {
      dispatch(show('Вы успешно сменили аватар сообщества!', 'success'));
      trigger(triggerUrl);
      trigger(postPartyUrl);
    })
    .catch(err => {
      dispatch(show('Ошибка смены аватара сообщества!', 'warning'));
      trigger(triggerUrl);
      trigger(postPartyUrl);
    });
};







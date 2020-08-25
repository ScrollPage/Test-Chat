import React, { useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '../components/Dialogs/Dialog';
import SearchDialog from '../components/Dialogs/SearchDialog';
import { useSelector, useDispatch } from 'react-redux';
import { getUserChats } from '../store/actions/messages';

const Dialogs = () => {

  const chats = useSelector(state => state.message.chats);
  const token = useSelector(state => state.auth.token);
  const username = useSelector(state => state.auth.username);
  const loading = useSelector(state => state.message.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token !== null) {
      dispatch(getUserChats(username, token));
    }
  }, [token])

  const renderChats = (chats) => (
    chats.map((chat, index) => (
      <Dialog
        key={`message__key__${chat.id}`}
        name={chat.participants.length === 2 ? chat.participants[0].user === username ? chat.participants[1].user : chat.participants[0].user : `Беседа Номер ${chat.id}`}
        chatURL={`/dialogs/${chat.id}`}
      />
    ))
  )

  return (
    <>
      <SearchDialog />
      <StyledDialogs>
        {loading ? 'Загрузка' :
          chats.length === 0 ? 'У вас нет диалогов' :
            renderChats(chats)}
      </StyledDialogs>
    </>
  );
}

export default Dialogs;

const StyledDialogs = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;


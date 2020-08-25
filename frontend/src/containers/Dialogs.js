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

  const dispatch = useDispatch();

  useEffect(() => {
    if (token !== null) {
      dispatch(getUserChats(username, token));
    }
  }, [token])

  const renderChats = (chats) => (
    chats.map(chat => (
      <Dialog
        key={chat.id}
        name={chat.participants.length === 2 ? chat.participants[0] === username ? chat.participants[1] : chat.participants[0] : `Беседа Номер ${chat.id}`}
        chatURL={`/dialogs/${chat.id}`}
      />
    ))
  )

  return (
    <>
      <SearchDialog />
      <StyledDialogs>
        {chats ? chats.length === 0 ? 'У вас нет диалогов' : renderChats(chats) : null}
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


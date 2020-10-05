import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createChat } from '@/store/actions/friend';
import LoadImage from '../UI/LoadImage';

interface IFriend {
  friendId: number;
  name: string;
  chatId: number | null;
  src?: string;
}

const Friend: React.FC<IFriend> = ({ friendId, name, chatId, src }) => {
  const dispatch = useDispatch();

  const { push } = useRouter();

  const chatIsNull = (): void => {
    if (chatId === null) {
      dispatch(createChat(friendId));
    } else {
      push('/dialogs/[chatID]', `/dialogs/${chatId}`, { shallow: true });
    }
  };

  return (
    <StyledFriend>
      <div>
        <LoadImage
          href="/userpage/[userID]"
          as={`/userpage/${friendId}`}
          size={'80'}
          src={src}
          isCircle={true}
        />
      </div>
      <div>
        <Link href="/userpage/[userID]" as={`/userpage/${friendId}`}>
          <a>
            <h4>{name}</h4>
          </a>
        </Link>
        <a onClick={() => chatIsNull()}>Написать сообщение</a>
      </div>
    </StyledFriend>
  );
};

export default Friend;

const StyledFriend = styled.div`
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > div {
    :first-of-type {
      margin-right: 30px;
    }
    :last-of-type {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      h4 {
        font-weight: bold;
        opacity: 0.8;
        margin-top: 0;
      }
    }
  }
`;

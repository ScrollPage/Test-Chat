import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { createChat } from '@/store/actions/friend';
import { StyledFriendItem } from './styles';
import ImageLink from '@/components/UI/Image/LinkImage';

interface IFriendItem {
  friendId: number;
  name: string;
  chatId: number | null;
  src?: string;
}

const FriendItem: React.FC<IFriendItem> = ({ friendId, name, chatId, src }) => {
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
    <StyledFriendItem>
      <div>
        <ImageLink
          href="/userpage/[userID]"
          as={`/userpage/${friendId}`}
          size={'80'}
          src={src}
          isCircle={true}
          isMedia={true}
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
    </StyledFriendItem>
  );
};

export default FriendItem;

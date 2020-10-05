import React from 'react';
import { Avatar } from 'antd';
import { IContactUser } from '@/types/people';
import styled, { css } from 'styled-components';
import LoadImage from '../UI/LoadImage';

interface UserFriends {
  friends: Array<IContactUser>;
}

const UserFriends: React.FC<UserFriends> = ({ friends }) => {
  return (
    <StyledUserFriends>
      {friends.map((friend, index) => (
        <StyledUserFriend key={`user-friends__key__${friend.id}`} end={index ? (index + 1) % 6 === 0 : undefined}>
          <div>
            <LoadImage isCircle={true} src={friend.avatar} size={'35'} />
          </div>
        </StyledUserFriend>
      ))}
    </StyledUserFriends>
  );
};

export default UserFriends;

const StyledUserFriends = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 10px;
  width: 220px;
`;

const StyledUserFriend = styled.div<{ end?: boolean }>`
  display: contents;
  > div {
    width: 25px;
    height: 25px;
  }
  ${props => props.end && css`
    &::after {
      content: '';
      width: 100%;
    }
  `}
`;

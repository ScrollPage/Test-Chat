import React from 'react';
import { IContactUser } from '@/types/people';
import LoadImage from '../../UI/Image/LoadImage';
import { StyledUserFriends, StyledUserFriend } from './styles';

interface UserFriends {
  people: Array<IContactUser>;
}

const UserFriends: React.FC<UserFriends> = ({ people }) => {
  return (
    <StyledUserFriends>
      {people.map((man, index) => (
        <StyledUserFriend
          key={`user-friends__key__${man.id}`}
          end={index ? (index + 1) % 6 === 0 ? 1 : undefined : undefined}
        >
          <div className="user-friends__avatar">
            <LoadImage
              href={'/userpage/[userID]'}
              as={`/userpage/${man.id}`}
              isCircle={true}
              src={man.small_avatar}
            />
          </div>
        </StyledUserFriend>
      ))}
    </StyledUserFriends>
  );
};

export default UserFriends;


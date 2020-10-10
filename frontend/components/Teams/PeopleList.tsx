import React from 'react';
import styled, { css } from 'styled-components';
import LoadImage from '../UI/LoadImage';
import { IPartyMember } from '@/types/party';

interface PeopleList {
  people: IPartyMember[];
}

const PeopleList: React.FC<PeopleList> = ({ people }) => {
  return (
    <StyledPeopleList>
      {people.map((man, index) => (
        <StyledUserFriend
          key={`user-friends__key__${man.id}`}
          end={index ? (index + 1) % 6 === 0 : undefined}
        >
          <div className="user-friends__avatar">
            <LoadImage
              href={'/userpage/[userID]'}
              as={`/userpage/${man.user.id}`}
              isCircle={true}
              src={man.user.small_avatar}
            />
          </div>
        </StyledUserFriend>
      ))}
    </StyledPeopleList>
  );
};

export default PeopleList;

const StyledPeopleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 10px;
  width: 200px !important;
  margin-left: -10px;
`;

const StyledUserFriend = styled.div<{ end?: boolean }>`
  display: contents;
  .user-friends__avatar {
    width: 25px;
    height: 25px;
  }
  ${props =>
    props.end &&
    css`
      &::after {
        content: '';
        width: 100%;
      }
    `}
`;

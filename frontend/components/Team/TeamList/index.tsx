import React from 'react';
import LoadImage from '../../UI/Image/LoadImage';
import { IPartyMember } from '@/types/party';
import { StyledMan, StyledTeamList } from './styles';

interface TeamList {
  people: IPartyMember[];
}

const TeamList: React.FC<TeamList> = ({ people }) => {
  return (
    <StyledTeamList>
      {people.map((man, index) => (
        <StyledMan
          key={`user-friends__key__${man.user.id}`}
          end={index ? (index + 1) % 6 === 0 ? 1 : undefined : undefined}
        >
          <div className="user-friends__avatar">
            <LoadImage
              href={'/userpage/[userID]'}
              as={`/userpage/${man.user.id}`}
              isCircle={true}
              src={man.user.small_avatar}
            />
          </div>
        </StyledMan>
      ))}
    </StyledTeamList>
  );
};

export default TeamList;
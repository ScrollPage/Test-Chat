import React from 'react';
import { Avatar } from 'antd';
import LoadImage from '../../UI/Image/LoadImage';
import { ITeam } from '@/types/contact';
import { StyledUserParties, StyledUserParty } from './styles';

interface UserParties {
  parties: ITeam[];
}

const UserParties: React.FC<UserParties> = ({ parties }) => {
  return (
    <StyledUserParties>
      {parties.map((party, index) => (
        <StyledUserParty key={`user-parties__key__${party.id}`} end={index ? (index + 1) % 6 === 0 : undefined}>
          <div className="user-parties__avatar" >
            <LoadImage
              href={'/teams/[partyID]'}
              as={`/teams/${party.id}`}
              isCircle={true}
              src={party.image}
            />
          </div>
        </StyledUserParty>
      ))}
    </StyledUserParties>
  );
};

export default UserParties;
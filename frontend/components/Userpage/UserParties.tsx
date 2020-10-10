import React from 'react';
import { Avatar } from 'antd';
import styled, { css } from 'styled-components';
import LoadImage from '../UI/LoadImage';
import { ITeam } from '@/types/contact';

interface UserParties {
  parties: ITeam[];
}

const UserParties: React.FC<UserParties> = ({ parties }) => {
  return (
    <StyledUserParties>
      {parties.map((party, index) => (
        <StyledUserFriend key={`user-parties__key__${party.id}`} end={index ? (index + 1) % 6 === 0 : undefined}>
          <div className="user-parties__avatar" >
            <LoadImage
              href={'/teams/[partyID]'}
              as={`/teams/${party.id}`}
              isCircle={true}
              src={party.image}
            />
          </div>
        </StyledUserFriend>
      ))}
    </StyledUserParties>
  );
};

export default UserParties;

const StyledUserParties = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 10px;
  width: 200px !important;
  margin-left: -10px;
`;

const StyledUserFriend = styled.div<{ end?: boolean }>`
  display: contents;
  .user-parties__avatar {
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

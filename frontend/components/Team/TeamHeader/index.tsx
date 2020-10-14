import { joinGroup } from '@/store/actions/teams';
import { IParty } from '@/types/party';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { mutate } from 'swr';
import LoadImage from '../../UI/Image/LoadImage';
import { StyledTeamHeader } from './styles';

interface ITeamHeader {
  groupName: string;
  isJoined: boolean;
  groupImage?: string;
  partyId?: number;
}

const TeamHeader: React.FC<ITeamHeader> = ({ groupName, isJoined, groupImage, partyId }) => {

  const dispatch = useDispatch();

  const joinHandler = (isJoin: boolean) => {
    if (partyId) {
      const groupLink = `/api/v1/group/${partyId}/`;
      mutate(groupLink, async (party: IParty) => {
        if (party) {
          return {
            ...party, 
            joined: isJoin
          }
        }
      })
      dispatch(joinGroup(partyId, !isJoin, groupLink));
    }
  }

  return (
    <StyledTeamHeader>
      <div className="party__image">
        <LoadImage isCircle={true} src={groupImage} size={'60'} />
      </div>
      <div className="party__name">
        <h2>{groupName}</h2>
      </div>
      <div className="party__joined">
        {isJoined ? (
          <Button
            onClick={() => joinHandler(false)}
            type="primary"
            danger
            ghost>
            Отписаться
          </Button>
        ) : (
          <Button onClick={() => joinHandler(true)} type="primary">Подписаться</Button>
        )}
      </div>
    </StyledTeamHeader>
  );
};

export default TeamHeader;


import { joinGroup } from '@/store/actions/teams';
import { IParty } from '@/types/party';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { mutate } from 'swr';
import LoadImage from '../UI/LoadImage';

interface IPartyHeader {
  groupName: string;
  isJoined: boolean;
  groupImage?: string;
  partyId?: number;
}

const PartyHeader: React.FC<IPartyHeader> = ({ groupName, isJoined, groupImage, partyId }) => {

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
    <StyledPartyHeader>
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
    </StyledPartyHeader>
  );
};

export default PartyHeader;

const StyledPartyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 20px;
`;

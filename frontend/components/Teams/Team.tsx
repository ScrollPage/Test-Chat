import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import LoadImage from '../UI/LoadImage';

interface ITeam {
  name: string;
  partyId: number;
  image?: string;
}

const Team: React.FC<ITeam> = ({ name, partyId, image }) => {
  return (
    <StyledTeam>
      <div>
        <LoadImage
          href="/teams/[partyID]"
          as={`/teams/${partyId}`}
          size={'80'}
          src={image}
          isCircle={true}
        />
      </div>
      <div>
        <Link
          href="/teams/[partyID]"
          as={`/teams/${partyId}`}
        >
          <a>
            <h4>{name}</h4>
          </a>
        </Link>
      </div>
    </StyledTeam>
  );
};

export default Team;

const StyledTeam = styled.div`
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

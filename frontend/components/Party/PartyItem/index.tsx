import React from 'react';
import Link from 'next/link';
import LoadImage from '../../UI/Image/LoadImage';
import { StyledPartyItem } from './styles';

interface ITeam {
  name: string;
  partyId: number;
  image?: string;
}

const PartyItem: React.FC<ITeam> = ({ name, partyId, image }) => {
  return (
    <StyledPartyItem>
      <div>
        <LoadImage
          href="/teams/[partyID]"
          as={`/teams/${partyId}`}
          size={'80'}
          src={image}
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
    </StyledPartyItem>
  );
};

export default PartyItem;

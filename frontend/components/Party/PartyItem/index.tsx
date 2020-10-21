import React from 'react';
import Link from 'next/link';
import { StyledPartyItem } from './styles';
import LinkImage from '@/components/UI/Image/LinkImage';

interface ITeam {
  name: string;
  partyId: number;
  image?: string;
}

const PartyItem: React.FC<ITeam> = ({ name, partyId, image }) => {
  return (
    <StyledPartyItem>
      <div>
        <LinkImage
          href="/teams/[partyID]"
          as={`/teams/${partyId}`}
          size={'80'}
          src={image}
          isMedia={true}
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

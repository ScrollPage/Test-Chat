import React from 'react';
import Link from 'next/link';
import { IChatParticipiant } from '@/types/chat';
import ImageLink from '../../UI/Image/LinkImage';
import { StyledDialog } from './styles';

interface IDialog {
  chatID: number;
  name: string;
  dialogUser?: IChatParticipiant;
}

const DialogItem: React.FC<IDialog> = ({ chatID, name, dialogUser }) => {
  return (
    <StyledDialog>
      {dialogUser && (
        <ImageLink
          href="/userpage/[userID]"
          as={`/userpage/${dialogUser.id}`}
          size={'40'}
          src={dialogUser.small_avatar}
        />
      )}
      <Link href="/dialogs/[chatID]" as={`/dialogs/${chatID}`}>
        <a>
          <div>{name}</div>
        </a>
      </Link>
    </StyledDialog>
  );
};

export default DialogItem;
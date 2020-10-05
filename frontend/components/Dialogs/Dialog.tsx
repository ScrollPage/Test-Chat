import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { IChatParticipiant } from '@/types/chat';
import LoadImage from '../UI/LoadImage';

interface IDialog {
  chatID: number;
  name: string;
  dialogUser: IChatParticipiant | null;
}

const Dialog: React.FC<IDialog> = ({ chatID, name, dialogUser }) => {
  return (
    <StyledDialog>
      {dialogUser && (
        <LoadImage
          href="/userpage/[userID]"
          as={`/userpage/${dialogUser.id}`}
          size={'40'}
          isCircle={true}
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

export default Dialog;

const StyledDialog = styled.div`
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

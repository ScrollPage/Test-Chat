import React from 'react';
import Link from 'next/link';
import { IChatParticipiant } from '@/types/chat';
import ImageLink from '../../UI/Image/LinkImage';
import { StyledDialog } from './styles';
import { useDispatch } from 'react-redux';
import { removeMessageNotify } from '@/store/actions/notify';
import { readChat } from '@/store/actions/message';

interface IDialog {
    chatId: number;
    name: string;
    dialogUser?: IChatParticipiant;
    unread: boolean;
}

const DialogItem: React.FC<IDialog> = ({
    chatId,
    name,
    dialogUser,
    unread,
}) => {
    const dispatch = useDispatch();

  const unreadHandler = () => {
        if (unread) {
            dispatch(removeMessageNotify());
            dispatch(readChat(chatId));
        }
    };
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
            <div className="dialog-item__main">
                {unread && (
                    <div className="dialog-item__unread">
                        <span>!</span>
                    </div>
                )}
                <Link
                    href="/dialogs/[chatID]"
                    as={`/dialogs/${chatId}`}
                >
                    <a>
                        <div onClick={unreadHandler}>{name}</div>
                    </a>
                </Link>
            </div>
        </StyledDialog>
    );
};

export default DialogItem;

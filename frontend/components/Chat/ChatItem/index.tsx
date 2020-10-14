import React from 'react';
import ImageLink from '@/components/UI/Image/LinkImage';
import { renderTimestamp } from '@/utils/index';
import { StyledChatItem } from './styles';

interface IChatItem {
    name: string;
    time: string;
    message: string;
    messageUserId: number;
    avatar?: string;
}

const ChatItem: React.FC<IChatItem> = ({ name, time, message, messageUserId, avatar }) => {
    return (
        <StyledChatItem>
            <div className="chat-item__avatar" >
                <ImageLink
                    href="/userpage/[userID]" 
                    as={`/userpage/${messageUserId}`}
                    src={avatar}
                />
            </div>
            <div className="chat-item__inner">
                <div className="chat-item__description">
                    <div className="chat-item__name" >{name}</div>
                    <div>
                        <small>{renderTimestamp(time)}</small>
                    </div>
                </div>
                <div className="chat-item__message">{message}</div>
            </div>
        </StyledChatItem>
    );
};

export default ChatItem;

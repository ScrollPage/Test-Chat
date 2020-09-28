import React from 'react';
import styled from 'styled-components';
import LinkAvatar from '@/components/UI/LinkAvatar';
import { renderTimestamp } from '@/utils/index';

interface IChatItem {
    name: string;
    time: string;
    message: string;
    isUsername: boolean;
    messageUserId: number;
}

const ChatItem: React.FC<IChatItem> = ({ name, time, message, isUsername, messageUserId }) => {
    return (
        <StyledChatItem>
            <div>
                <LinkAvatar
                    href="/userpage/[userID]" 
                    as={`/userpage/${messageUserId}`}
                    style={{ marginRight: '15px' }}
                    isUsername={isUsername}
                />
            </div>
            <div className="chat-item__inner">
                <div className="chat-item__description">
                    <div>{name}</div>
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

const StyledChatItem = styled.div`
    width: 100%;
    display: flex;
    padding: 10px;
    align-items: flex-start;
    .chat-item__inner {
        display: flex;
        flex-direction: column;
        .chat-item__description {
            display: flex;
            > div {
                &:first-of-type {
                    margin-right: 10px;
                }
            }
        }
    }
`;

import React from 'react';
import styled from 'styled-components';
import LinkAvatar from '@/components/UI/LinkAvatar';
import { renderTimestamp } from '@/utils/index';
import LoadImage from '../UI/LoadImage';

interface IChatItem {
    name: string;
    time: string;
    message: string;
    isUsername: boolean;
    messageUserId: number;
    avatar?: string;
}

const ChatItem: React.FC<IChatItem> = ({ name, time, message, isUsername, messageUserId, avatar }) => {
    return (
        <StyledChatItem>
            <div className="chat-item__avatar" >
                <LoadImage
                    href="/userpage/[userID]" 
                    as={`/userpage/${messageUserId}`}
                    src={avatar}
                    isCircle={true}
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

const StyledChatItem = styled.div`
    width: 100%;
    display: flex;
    padding: 10px;
    align-items: flex-start;
    .chat-item {
        &__avatar {
            margin-right: 15px;
        }
        &__inner {
            display: flex;
            flex-direction: column;
        }
        &__description {
            display: flex;
        }
        &__name {
            margin-right: 10px;
            font-weight: 500;
        }
    }
    .chat-item__avatar {
        
    }
    .chat-item__inner {
        
        .chat-item__description {
            
        }
    }
`;

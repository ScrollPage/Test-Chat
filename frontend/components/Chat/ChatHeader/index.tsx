import React from 'react';
import { StyledChatHeader } from './styles';
import { LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ImageLink from '../../UI/Image/LoadImage';
import { IChatInfo } from '@/types/chat';

interface IChatHeader {
    chatInfo: IChatInfo;
}

const ChatHeader: React.FC<IChatHeader> = ({ chatInfo }) => {
    return (
        <StyledChatHeader>
            <Link href="/dialogs">
                <a>
                    <div className="chat-header__nav">
                        <div>
                            <LeftOutlined />
                        </div>
                        <div>Назад</div>
                    </div>
                </a>
            </Link>
            <div>{`${chatInfo.companion.first_name} ${chatInfo.companion.last_name}`}</div>
            <div>
                <ImageLink
                    src={chatInfo.companion.small_avatar}
                    href="/userpage/[userID]" 
                    as={`/userpage/${chatInfo.companion.id}`}
                />
            </div>
        </StyledChatHeader>
    );
};

export default ChatHeader;

import React from 'react';
import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
import { IChatInfo } from '@/types/chat';
import LoadImage from '../UI/LoadImage';

interface IChatHeader {
    chatInfo: IChatInfo | null;
}

const ChatHeader: React.FC<IChatHeader> = ({ chatInfo }) => {
    console.log(chatInfo)

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
            <div>{`${chatInfo?.companion?.first_name} ${chatInfo?.companion?.last_name}`}</div>
            <div>
                <LoadImage
                    src={chatInfo?.companion?.small_avatar}
                    isCircle={true}
                />
            </div>
        </StyledChatHeader>
    );
};

export default ChatHeader;

const StyledChatHeader = styled.div`
    z-index: 1;
    background: white;
    position: sticky;
    top: 0px;
    width: 100%;
    height: 60px;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 575.98px) {
        padding-top: 15px;
        padding-right: 0;
    }
    .chat-header__nav {
        width: 100%;
        cursor: pointer !important;
        height: 100%;
        display: flex;
        align-items: center;
        > div {
            &:first-of-type {
                margin-right: 20px;
            }
        }
    }
`;

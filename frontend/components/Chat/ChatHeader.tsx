import React from 'react';
import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';

const ChatHeader: React.FC = () => {
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
            <div>Название</div>
            <div>
                <Avatar icon={<UserOutlined />} />
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

import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface IDialog {
    chatID: number;
    name: string;
    dialogUserId: number;
}

const Dialog: React.FC<IDialog> = ({ chatID, name, dialogUserId }) => {
    return (
        <StyledDialog>
            {dialogUserId
                ? (<Link href="/userpage/[userID]" as={`/userpage/${dialogUserId}`}>
                    <a>
                        <div>
                            <Avatar
                                style={{ backgroundColor: '#87d068' }}
                                icon={<UserOutlined />}
                            />
                        </div>
                    </a>
                </Link>)
                : (<div>
                    <Avatar
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<UserOutlined />}
                    />
                </div>)}
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

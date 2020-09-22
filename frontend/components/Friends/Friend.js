import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { createChat } from '@/store/actions/friend';

const Friend = ({ userId, name, chatId }) => {
    const dispatch = useDispatch();

    const { push } = useRouter();

    const chatIsNull = () => {
        if (chatId === null) {
            dispatch(createChat(userId));
        } else {
            push('/dialogs/[chatID]', `/dialogs/${chatId}`, { shallow: true });
        }
    };

    return (
        <StyledFriend>
            <div>
                <Link href="/userpage/[userID]" as={`/userpage/${userId}`}>
                    <a>
                        <Avatar
                            style={{ backgroundColor: '#87d068' }}
                            size={80}
                            icon={<UserOutlined />}
                        />
                    </a>
                </Link>
            </div>
            <div>
                <Link href="/userpage/[userID]" as={`/userpage/${userId}`}>
                    <a>
                        <h4>{name}</h4>
                    </a>
                </Link>
                <a onClick={() => chatIsNull()}>Написать сообщение</a>
            </div>
        </StyledFriend>
    );
};

export default Friend;

const StyledFriend = styled.div`
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > div {
        :first-of-type {
            margin-right: 30px;
        }
        :last-of-type {
            height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            h4 {
                font-weight: bold;
                opacity: 0.8;
            }
        }
    }
`;

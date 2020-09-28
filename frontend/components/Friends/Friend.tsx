import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { createChat } from '@/store/actions/friend';
import LinkAvatar from '@/components/UI/LinkAvatar';

interface IFriend {
    userId: number;
    name: string;
    chatId: number;
}

const Friend: React.FC<IFriend> = ({ userId, name, chatId }) => {
    const dispatch = useDispatch();

    const { push } = useRouter();

    const chatIsNull = (): void => {
        if (chatId === null) {
            dispatch(createChat(userId));
        } else {
            push('/dialogs/[chatID]', `/dialogs/${chatId}`, { shallow: true });
        }
    };

    return (
        <StyledFriend>
            <div>
                <LinkAvatar
                    href="/userpage/[userID]" 
                    as={`/userpage/${userId}`}
                    isUsername={false}
                    size={80}
                />
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
                margin-top: 0;
            }
        }
    }
`;

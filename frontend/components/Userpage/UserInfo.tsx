import { IContact } from '@/types/contact';
import React from 'react';
import styled from 'styled-components';

interface IUserInfo {
    contact: IContact;
}

const UserInfo: React.FC<IUserInfo> = ({ contact }) => {
    return (
        <StyledUserInfo>
            <div>
                <h1>{`${contact.first_name} ${contact.last_name}`}</h1>
                <small>
                    {contact.info.status === '' ? 'У вас нет статуса' : contact.info.status}
                </small>
                <hr />
                <h4>Подробная информация: </h4>
                <ul>
                    <li>E-mail: {contact.email}</li>
                    <li>Номер телефона: {contact.phone_number}</li>
                </ul>
            </div>
        </StyledUserInfo>
    );
};

export default UserInfo;

const StyledUserInfo = styled.div`
    flex: 1;
    margin-bottom: 20px;
    > div {
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        padding: 20px;
        flex-direction: column;
    }
    ul,
    li {
        list-style: none;
        padding: 0;
    }
    hr {
        width: 100%;
        background-color: #1890ff;
        border: 1px solid #1890ff;
    }
    @media (max-width: 900px) {
        margin-top: 20px;
    }
`;

import { IContact } from '@/types/contact';
import React from 'react';
import { StyledUserInfo } from './styles';

interface IUserInfo {
    contact: IContact;
}

const UserInfo: React.FC<IUserInfo> = ({ contact }) => {
    return (
        <StyledUserInfo>
            <div>
                <h1>{`${contact.first_name} ${contact.last_name}`}</h1>
                <small>
                    {contact.info.status === ''
                        ? 'У вас нет статуса'
                        : contact.info.status}
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

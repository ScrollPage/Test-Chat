import { IContact } from '@/types/contact';
import React from 'react';
import { StyledUserInfo } from './styles';
import { useState } from 'react';

interface IUserInfo {
    contact: IContact;
}

const UserInfo: React.FC<IUserInfo> = ({ contact }) => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <StyledUserInfo>
            <div>
                <h1>{`${contact.first_name} ${contact.last_name}`}</h1>
                <p>
                    <span>Статус:&nbsp;</span>
                    {!contact.info?.status ? '...' : contact.info.status}
                </p>
                <hr />
                <div
                    className="user-info__show"
                    onClick={() => setShowInfo(state => !state)}
                >
                    <h3>
                        {!showInfo
                            ? 'Показать подробную информацию'
                            : 'Скрыть подробную информацию'}
                    </h3>
                </div>
                {showInfo && (
                    <ul>
                        <li>
                            <p>
                                <span>E-mail:&nbsp;</span>
                                {contact?.email}
                            </p>
                        </li>
                        <li>
                            <p>
                                <span>Номер телефона:&nbsp;</span>
                                {contact?.phone_number}
                            </p>
                        </li>
                        <li>
                            <p>
                                <span>Дата рождения:&nbsp;</span>
                                {contact.info?.birth_date}
                            </p>
                        </li>
                        <li>
                            <p>
                                <span>Страна:&nbsp;</span>
                                {contact.info?.country}
                            </p>
                        </li>
                        <li>
                            <p>
                                <span>Город:&nbsp;</span>
                                {contact.info?.city}
                            </p>
                        </li>
                    </ul>
                )}
            </div>
        </StyledUserInfo>
    );
};

export default UserInfo;

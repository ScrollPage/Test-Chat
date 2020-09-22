import React from 'react';
import styled from 'styled-components';

const UserInfo = ({ data }) => {
    return (
        <StyledUserInfo>
            <div>
                <h1>{`${data.first_name} ${data.last_name}`}</h1>
                <small>
                    {data.status === '' ? 'У вас нет статуса' : data.status}
                </small>
                <hr />
                <h4>Подробная информация: </h4>
                <ul>
                    <li>E-mail: {data.email}</li>
                    <li>Номер телефона: {data.phone_number}</li>
                </ul>
            </div>
        </StyledUserInfo>
    );
};

export default UserInfo;

const StyledUserInfo = styled.div`
    flex: 1;
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

import styled from 'styled-components';

export const StyledUserInfo = styled.div`
    flex: 1;
    margin-bottom: 20px;
    > div {
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        padding: 10px 20px;
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
    span {
        font-weight: 600;
    }
    p {
        margin: 5px 0;
    }
    h1 {
        margin-bottom: 0px;
    }
    h3 {
        text-align: center;
        margin: 0;
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
    }
    .user-info__show {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 5px 0;
        cursor: pointer;
        &:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }
    }
    @media (max-width: 900px) {
        margin-top: 20px;
    }
`;

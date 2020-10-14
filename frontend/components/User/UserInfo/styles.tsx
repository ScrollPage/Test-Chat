import styled from 'styled-components';

export const StyledUserInfo = styled.div`
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
